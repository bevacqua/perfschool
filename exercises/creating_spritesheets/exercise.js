'use strict';

var psi = require('psi');
var tmp = require('tmp');
var path = require('path');
var contra = require('contra');
var webshot = require('webshot');
var imageDiff = require('image-diff-2');
var localtunnel = require('localtunnel');
var wat = require('workshopper-wat');
var exercise = wat({ verify: verify, request: false });

module.exports = exercise;

function verify (t, req) {
  var expected = path.join(__dirname, 'expected.png');
  var actual = tmp.tmpNameSync({ postfix: '.png' });
  var diff = tmp.tmpNameSync({ postfix: '.png' });
  var tunnel;

  contra.concurrent({ psi: insights, screenshot: screenshot }, assessment);

  function insights (next) {
    console.log('\n' + exercise.__('tunnel', { port: req.port }));
    localtunnel(req.port, tunneled);

    function tunneled (err, tune) {
      if (err) {
        next(err); return;
      }
      tunnel = tune;
      console.log(exercise.__('get_feedback', { url: tune.url }));
      psi(tune.url, next);
    }
  }

  function screenshot (done) {
    contra.series({
      take: function take (next) {
        webshot(req.url, actual, next);
      },
      compare: function compare (next) {
        imageDiff({
          actualImage: actual,
          expectedImage: expected,
          diffImage: diff,
          threshold: 0.1
        }, next);
      }
    }, done);
  }

  function assessment (err, result) {
    if (err) {
      t.error(err); return;
    }
    var amount = result.psi.pageStats.numberResources;
    tunnel.close();
    t.fgroup('overall');
    t.fpass('psi_score', { amount: amount }, amount < 5);
    t.fpass('visualcomp', result.screenshot.compare);
    t.end();
  }
}
