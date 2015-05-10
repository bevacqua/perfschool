'use strict';

var url = require('url');
var path = require('path');
var cheerio = require('cheerio');
var localtunnel = require('localtunnel');
var wat = require('workshopper-wat');
var amount = randomAmountOfCats();
var exercise = wat({
  verify: verify
});

module.exports = exercise;

function verify (t, req, res) {
  console.log('\n' + exercise.__('tunnel', { port: req.port }));
  localtunnel(req.port, tunneled);

  function tunneled (err, tunnel) {
    if (err) {
      next(err); return;
    }
    console.log(exercise.__('get_feedback', { url: tunnel.url }));
    psi(tunnel.url, stats);
    function stats (err, data) {
      if (err) {
        next(err); return;
      }

      var $ = cheerioOrBail(res.body);
      if ($ === void 0) {
        return;
      }

      console.log(data.pageStats);

      var type = res.headers['content-type'];
      var expectedType = 'text/html';

      t.fgroup('main_group');
      t.fpass('content_type', { type: expectedType }, type.indexOf(expectedType) === 0);
    }
  }

  function cheerioOrBail (body) {
    try {
      return cheerio.load(body);
    } catch (err) {
      t.end(err);
    }
  }
}
