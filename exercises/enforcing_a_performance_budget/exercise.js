'use strict';

var _ = require('lodash');
var psi = require('psi');
var cheerio = require('cheerio');
var localtunnel = require('localtunnel');
var wat = require('workshopper-wat');
var exercise = wat({ verify: verify });

module.exports = exercise;

function verify (t, req, res) {
  console.log('\n' + exercise.__('tunnel', { port: req.port }));
  localtunnel(req.port, tunneled);

  function tunneled (err, tunnel) {
    if (err) {
      next(err); return;
    }
    console.log(exercise.__('get_feedback', { url: tunnel.url }));
    psi(tunnel.url, { strategy: 'desktop' }, stats);
    function stats (err, pagespeed) {
      if (err) {
        next(err); return;
      }

      var $ = cheerioOrBail(res.body);
      if ($ === void 0) {
        return;
      }

      var type = res.headers['content-type'];
      var expectedType = 'text/html';
      var cats = $('img[src]');
      var expectedCats = 8;
      var pagespeedMin = 80;
      var rcatty = /(cat|kitten)s/i;

      t.fgroup('main_group');
      t.fpass('content_type', { type: expectedType }, type.indexOf(expectedType) === 0);
      t.fpass('catty', rcatty.test(res.body));
      t.fpass('pagespeed_score', { score: pagespeed.score, min: pagespeedMin }, pagespeed.score > pagespeedMin);
      t.end();
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
