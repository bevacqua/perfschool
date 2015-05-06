'use strict';

var cheerio = require('cheerio');
var factory = require('../../lib/factory');
var exercise = factory({ verify: verify });

module.exports = exercise;

function verify (t, res) {
  var $ = cheerio.load(res.body);
  var scripts = $('script');
  if (scripts.length === 0) {
    t.ffail('empty', { tag: 'script' });
  }
  var styles = $('link[rel="stylesheet"]');
  if (styles.length === 0) {
    t.ffail('empty', { tag: 'style' });
  }
  var sources = [];

  scripts.each(validateScript);
  styles.each(validateStyle);

  function validateScript () {
    var el = $(this);
    var nonblocking = !!el.attr('async');
    var src = el.attr('src');
    if (src) {
      t.fgroup('script', { src: src });
      if (sources.indexOf(src) !== -1) {
        t.ffail('dupe'); return;
      }
      sources.push(src);
      t.fpass('body', el.parent().is('body'));
      t.fpass('bottom', el.nextAll().length === el.nextAll('script').length);
      t.fpass('async', nonblocking);
    }
  }

  function validateStyle () {
    var el = $(this);
    var href = el.attr('href')
    t.fgroup('link', { href: href });
    t.fpass('noscript', el.parent().is('noscript'));
  }

  t.end();
}
