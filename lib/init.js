'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var contra = require('contra');
var root = path.join(__dirname, '..');
var rname = /\/exercises\/([a-z_]+)\/kit\//;

function init () {
  console.log('Copying files over to %s!', chalk.red('./perfschool-playground'));

  var files = glob.sync(path.join(__dirname, '../exercises/*/kit/**/*'));

  contra.each(files, copy, done);

  function copy (src, next) {
    var dest = src.replace(root, '.').replace(rname, '/perfschool-playground/$1/');

    mkdirp.sync(path.dirname(dest));

    var write = fs.createWriteStream(dest);
    var read = fs.createReadStream(src);

    read.on('end', next).pipe(write);
  }

  function done () {
    console.log('Change directory into %s and start workshopping!\n%s',
      chalk.red('./perfschool-playground'),
      chalk.yellow('cd perfschool-playground && perfschool')
    );
  }
}

module.exports = init;
