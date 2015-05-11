'use strict';

/*
 * The secret key below is for perfschool, and getting your own is free.
 * https://api.imgur.com/oauth2/addclient
 *
 * Yes. This is a terrible practice. Please be gentle about it.
 * Always keep your secret keys in environment variables.
 * Never hard-code them into your app like I just did.
 *
 * See also: http://12factor.net/config
 */
var IMGUR_CLIENT_ID = '21951160fc129ea';

var _ = require('lodash');
var gm = require('gm');
var url = require('url');
var path = require('path');
var util = require('util');
var request = require('request');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

app.get('/cats', cats);
app.get('/lynx', lynx);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function cats (req, res) {
  var url = 'https://api.imgur.com/3/gallery/r/kittens';
  var options = {
    headers: { Authorization: 'Client-ID ' + IMGUR_CLIENT_ID },
    qs: { q_size_px: 'small' },
    url: url,
    json: true
  };
  request(options, got);

  function got (err, response) {
    var title = '<title>Optimizing Images!</title>';
    var cats = _.pluck(response.body.data, 'link');
    var html = title + random(cats, req.query.amount).map(toImageTag).join('\n');
    res.contentType('text/html');
    res.end(html);
  }

  function random (cats, amount) {
    var result = [];
    while (amount--) {
      result.push.apply(result, cats.splice(Math.floor(Math.random() * cats.length), 1));
    }
    return result;
  }

  function toImageTag (cat) {
    return util.format('<img src=\'/lynx?source=%s\' />', cat);
  }
}

function lynx (req, res) {
  var src = req.query.source;
  var base = path.basename(src);
  var local = 'http://localhost:' + port;
  var qualified = url.resolve(local, src);
  gm(request(qualified), base)
    .autoOrient()
    .noProfile() // remove exif data
    .resize(500, 500) // set maximum image size
    .stream('jpg') // convert to jpg and avoid bloated gifs
    .pipe(res);
}
