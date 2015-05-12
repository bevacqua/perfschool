'use strict';

var _ = require('lodash');
var fs = require('fs');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var unpack = require('browser-unpack');
var repack = require('repack-rows');
var chalk = require('chalk');
var url = require('url');
var jsdom = require('jsdom');
var cheerio = require('cheerio');
var request = require('request');
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

  var script = $('script[src]');
  if (script.length === 0) {
    t.ffail('empty', { tag: 'script' });
  }
  var scriptHref = script.attr('src');

  t.groupend();

  console.log(exercise.__('boot_jsdom', { process: chalk.yellow('jsdom') }));
  jsdom.env({
    url: req.url,
    src: [jquery],
    features: {
      FetchExternalResources: ['link'],
      ProcessExternalResources: []
    },
    done: domloaded
  });

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
    foit('Lato', '.lato');
    foit('Cardo', '.cardo');
    foit('Roboto', '.roboto');
    foit('Merriweather', '.merriweather');

    if (scriptHref) {
      request(url.resolve(req.url, scriptHref), gotScript);
    } else {
      t.end();
    }

    function foit (face, selector) {
      var family = $(selector).css('font-family');
      t.fgroup('face', { face: face });
      t.fpass('foited', family.indexOf(face) === -1);
      t.groupend();
    }

    function gotScript (err, res, body) {
      if (err) {
        t.error(err); return;
      }
      global.document = window.document;

      var ffol = sinon.spy();
      var rows = unpack(body);
      var main = repack(rows, { fontfaceonload: ffol });

      delete global.document;

      ffolc('Lato');
      ffolc('Cardo');
      ffolc('Roboto');
      ffolc('Merriweather');
      t.fpass('ffol-count', { lib: chalk.yellow('fontfaceonload'), count: 4 }, ffol.callCount === 4);
      t.end();

      function ffolc (face) {
        t.fgroup('face', { face: face });
        t.fpass('ffol-correct', { lib: chalk.yellow('fontfaceonload') }, _.any(ffol.getCalls(), matches));
        t.groupend();
        function matches (call) {
          return call.args[0] === face && call.args[1] && typeof call.args[1].success === 'function';
        }
      }
    }
  }
}
