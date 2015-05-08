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

var express = require('express');
var app = express();
var port = process.argv[2] || 7777;

app.get('/cats', cats);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function cats (req, res) {
  res.end(req.query.amount + ' paws, such purr');
}
