'use strict';

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

  var scriptSources = [];
  var linkSources = [];

  scripts.each(validateScript);
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

  function validateScript () {
    var el = $(this);
    var nonblocking = !!el.attr('async');
    var src = el.attr('src');
    if (src) {
      t.fgroup('script', { src: src });
      if (scriptSources.indexOf(src) !== -1) {
        t.ffail('dupe', { tag: 'script' }); return;
      }
      scriptSources.push(src);
      t.fpass('body', el.parent().is('body'));
      t.fpass('bottom', el.nextAll().length === el.nextAll('script').length);
      t.fpass('async', nonblocking);
      t.groupend();
    }
  }

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
    linkSources.forEach(verifyLink);
    t.end();

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
