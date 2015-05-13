'use strict';

var gm = require('gm');
var url = require('url');
var psi = require('psi');
var chalk = require('chalk');
var path = require('path');
var concat = require('concat-stream');
var cheerio = require('cheerio');
var request = require('request');
var prettyBytes = require('pretty-bytes');
var pictureTube = require('picture-tube');
var localtunnel = require('localtunnel');
var wat = require('workshopper-wat');
var amount = randomAmountOfCats();
var endpoint = '/cats?amount=' + amount;
var exercise = wat({ verify: verify, endpoint: endpoint });

module.exports = exercise;

function randomAmountOfCats () {
  return Math.floor(Math.random() * 25) + 4;
}

function verify (t, req, res) {
  console.log('\n' + exercise.__('tunnel', { port: req.port }));
  localtunnel(req.port, tunneled);

  function tunneled (err, tunnel) {
    if (err) {
      next(err); return;
    }
    console.log(exercise.__('get_feedback', { url: tunnel.url + endpoint }));
    psi(tunnel.url + endpoint, stats);
    function stats (err, data) {
      if (err) {
        next(err); return;
      }

      var $ = cheerioOrBail(res.body);
      if ($ === void 0) {
        return;
      }

      var type = res.headers['content-type'];
      var expectedType = 'text/html';
      var images = parseInt(data.pageStats.imageResponseBytes, 10) || 0; // obscure: PageSpeed returns this as a string
      var expectedSize = amount * 1024 * 25; // 25kB per cat
      var prettyImages = prettyBytes(images);
      var prettyExpectation = prettyBytes(expectedSize);
      var cats = $('img[src]');

      t.fgroup('main_group');
      t.fpass('content_type', { type: expectedType }, type.indexOf(expectedType) === 0);
      t.fpass('cat_amount', { amount: amount }, cats.length === amount);
      t.fpass('image_size', { expected: prettyExpectation, actual: prettyImages }, images < expectedSize);

      if (cats.length === 0) {
        t.end(); return;
      }

      var tube = pictureTube();
      var src = cats.attr('src');
      var qualified = url.resolve(tunnel.url, src);
      var base = path.basename(src);
      var concatStream = concat(gotCat);

      console.log(exercise.__('get_cat_example', { url: qualified }));
      gm(request(qualified), base).stream('png').pipe(tube);
      tube.pipe(concatStream);
    }

    function gotCat (cat) {
      tunnel.close();
      console.log('\n' + chalk.magenta('# ' + exercise.__('is_this_a_cat') + '\n'));
      console.log(cat.toString().split('\n').slice(5, 30).join('\n'));
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

function banner (cat) {
  var len = Math.min(process.stdout.columns - 1, 140) * 12;
  return cat.split('\n').map(trim).join('\n');

  function trim (line) {
    return line.substr(0, len) + line.substr(-5);
  }
}
