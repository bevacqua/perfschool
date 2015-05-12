'use strict';

var cave = require('cave');
var path = require('path');
var chalk = require('chalk');
var jsdom = require('jsdom');
var cheerio = require('cheerio');
var wat = require('workshopper-wat');
var jquery = require('../../lib/jquery');
var exercise = wat({ verify: verify });

module.exports = exercise;

function verify (t, req, res) {
  var body = res.body;
  var $ = cheerioOrBail();
  if ($ === void 0) {
    return;
  }

  t.fgroup('sanity');

  var scripts = $('script');
  if (scripts.length === 0) {
    t.ffail('empty', { tag: 'script' });
  }
  var styles = $('link[rel="stylesheet"]');
  if (styles.length === 0) {
    t.ffail('empty', { tag: 'link' });
  }

  t.groupend();

  var expectation = path.join(__dirname, 'expected.css');
  var css = $('style').html();
  var diff = cave(expectation, { css: css }).trim();

  t.fgroup('inlining');
  t.fpass('inlined', diff.length === 0);

  t.groupend();

  var scriptSources = [];
  var linkSources = [];

  styles.each(validateStyle);

  console.log(exercise.__('boot_jsdom', { process: chalk.yellow('jsdom') }));
  jsdom.env({
    html: body,
    src: [jquery],
    features: {
      FetchExternalResources: ['script'],
      ProcessExternalResources: ['script']
    },
    done: domloaded
  });

  function validateStyle () {
    var el = $(this);
    var href = el.attr('href');
    t.fgroup('link', { href: href });
    t.fpass('noscript', el.parent().is('noscript'));
    linkSources.push(href);
    t.groupend();
  }

  function cheerioOrBail () {
    try {
      return cheerio.load(body);
    } catch (err) {
      t.end(err);
    }
  }

  function domloaded (err, window) {
    if (err) {
      t.error(err.length ? err[0] : err); return;
    }
    var $ = window.$;

    setTimeout(waitOneBit, 1000);

    function waitOneBit () {
      linkSources.forEach(verifyLink);
      t.end();
    }

    function verifyLink (href) {
      t.fgroup('link', { href: href });

      var links = $('link').filter(byLinkAndMedia);
      if (links.length === 0) {
        t.ffail('noloadcss');
      } else if (links.length > 1) {
        t.ffail('dupe', { tag: 'link' });
      } else {
        t.fpass('deferred', links.attr('media') === 'all');
      }
      t.groupend();

      function byLinkAndMedia () {
        var el = $(this);
        var matches = el.attr('href') === href;
        return matches;
      }
    }
  }
}
