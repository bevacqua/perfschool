'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 7777;

app.get('/cats', cats);
app.listen(port, listening);

function listening () {
  console.log('Listening on port', port);
}

function cats (req, res) {
  res.end(req.query.amount + ' paws, such purr');
}
