'use strict';

var url = require('url');
var css = require('css');
var chalk = require('chalk');
var util = require('util');
var contra = require('contra');
var request = require('request');
var cheerio = require('cheerio');
var wat = require('workshopper-wat');
var exercise = wat({ verify: verify });

module.exports = exercise;

function verify (t, req, res) {
  var matches = 0;
  var total = 0;
  var failures = [];
  var body = res.body;
  var $ = cheerioOrBail();
  if ($ === void 0) {
    return;
  }

  t.fgroup('sanity');

  var styles = $('link[rel="stylesheet"]');
  if (styles.length === 0) {
    t.ffail('empty', { tag: 'link' });
  }

  t.groupend();
  contra.map(Array.prototype.slice.call(styles.map(toHref)), fetch, fetched);

  function toHref (el) {
    return $(this).attr('href');
  }

  function fetch (href, next) {
    var absolute = url.resolve('http://localhost:' + req.port, href);
    request(absolute, function got (err, res) {
      t.fgroup('resource', { href: href });
      t.fpass('fetched', !err);

      if (err) {
        next(err); return;
      }

      var ast = css.parse(res.body, { silent: true });

      t.fpass('type', res.headers['content-type'].indexOf('text/css') === 0);
      t.fpass('valid', ast.stylesheet.parsingErrors.length === 0);

      t.groupend();
      next(err, ast);
    });
  }

  function fetched (err, results) {
    if (err) {
      t.error(err); return;
    }

    t.fgroup('overview');
    results.forEach(verifyAST);
    t.fpass('relevant_rules', { matches: matches, total: total }, matches === total);

    if (failures.length) {
      var failed = util.format(chalk.red('"%s"'), failures.slice(0, 100).join(', '));
      if (failures.length > 100) {
        failed += exercise.__('others', { more: failures.length - 100 });
      }
      t.ffail('unused', { selectors: failed + '.' });
    }

    t.groupend();
    t.end();
  }

  function verifyAST (ast) {
    verifyTree(ast.stylesheet);
  }

  function verifyTree (ast) {
    ast.rules.forEach(verifyRule);
  }

  function verifyRule (rule) {
    if (rule.type === 'media') {
      verifyTree(rule); return;
    }
    if (rule.type === 'rule') {
      rule.selectors.forEach(verifySelector);
    }
  }

  function verifySelector (selector) {
    var any = attempt(selector);
    if (any) {
      matches++;
    } else if (failures.indexOf(selector) === -1) {
      failures.push(selector);
    }
    total++;
  }

  function attempt (selector) {
    var sane = selector.replace(/:+[A-z-]+/g, '') || '*';
    try {
      return $(sane).length > 0;
    } catch (e) {
      return true; // we just ignore complicated selectors
    }
  }

  function cheerioOrBail () {
    try {
      return cheerio.load(body);
    } catch (err) {
      t.end(err);
    }
  }
}
