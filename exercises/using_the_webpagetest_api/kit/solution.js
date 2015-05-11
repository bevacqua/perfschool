'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

app.get('/', home);
app.get('/test', test);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function home (req, res) {
  var file = path.join(__dirname, 'index.html');
  var index = fs.readFileSync(file, 'utf8');
  res.send(index);
}

function test (req, res) {
  res.end('Not very testful!');
}
