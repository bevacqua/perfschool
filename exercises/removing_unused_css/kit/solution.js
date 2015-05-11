'use strict';

var serveStatic = require('serve-static');
var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

app.use(serveStatic(__dirname));
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}
