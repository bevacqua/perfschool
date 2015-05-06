'use strict';

var cheerio = require('cheerio');
var factory = require('../../lib/factory');
var exercise = factory({ verify: verify });

module.exports = exercise;

function verify (t, res) {
  var $ = cheerio.load(res.body);
  var scripts = $('script');
  if (scripts.length === 0) {
    t.ffail('empty');
  }
  var sources = [];

  scripts.each(validate);

  function validate () {
    var el = $(this);
    var nonblocking = !!el.attr('async');
    var src = el.attr('src');
    if (src) {
      t.fgroup('script', { src: src });
      if (sources.indexOf(src) !== -1) {
        t.ffail('dupe');
      }
      sources.push(src);
      t.fpass('async', nonblocking);
    }
    t.fpass('body', el.parent().is('body'));
    t.fpass('bottom', el.nextAll().length === el.nextAll('script').length);
  }

  t.end();
}
