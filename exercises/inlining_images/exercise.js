'use strict';

var chalk = require('chalk');
var cheerio = require('cheerio');
var wat = require('workshopper-wat');
var exercise = wat({ verify: verify });

module.exports = exercise;

function verify (t, req, res) {
  var $ = cheerioOrBail();
  if ($ === void 0) {
    return;
  }

  t.fgroup('sanity');

  var expectation = require('./expectation.json');
  var max = 6;
  var images = $('img[src]');
  if (images.length !== max) {
    t.ffail('tamper', { count: max });
  }

  t.groupend();
  t.fgroup('matches');

  Array.prototype.slice.call(images.map(toSource), 0, max).forEach(compare);

  t.end();

  function toSource (el) {
    return $(this).attr('src') || '';
  }

  function compare (src, i) {
    if (i === 0) {
      t.fpass('hodor', src && src.indexOf('data:') === -1); return;
    }
    t.fpass('expectation', { src: chalk.yellow(expectation[i].src) }, src === expectation[i].blob);
  }

  function cheerioOrBail () {
    try {
      return cheerio.load(res.body);
    } catch (err) {
      t.error(err);
    }
  }
}
