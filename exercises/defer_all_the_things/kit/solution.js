'use strict';

var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

app.get('/', function (req,res,next) {
  res.send(fs.readFileSync(path.join(__dirname,'index.html'), 'utf8'));
});
app.listen(process.argv[2] || 3000);
