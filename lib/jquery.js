'use strict';

var fs = require('fs');
var path = require('path');
var file = path.join(__dirname, '..', 'node_modules/jquery/dist/jquery.min.js');
var jquery = fs.readFileSync(file, 'utf8');

module.exports = jquery;
