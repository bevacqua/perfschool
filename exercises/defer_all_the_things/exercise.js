'use strict';

var cheerio = require('cheerio');
var factory = require('../../lib/factory');

module.exports = factory({
  verify: verify
});

function verify (res, next) {
  var responseText = res.body;
  var $ = cheerio.load(responseText);

  next(null, [
    { message: $('body').text().trim(), passed: true },
    { message: 'Bar', passed: false }
  ]);
}
