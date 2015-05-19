'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('util');
var glob = require('glob');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var contra = require('contra');
var ts = require('through2-concat');
var root = path.join(__dirname, '..');
var rname = /\/exercises\/([a-z_]+)\/(kit\/)?/;

function init (ws) {
  console.log(ws.__('init.copying', { target: chalk.red('./perfschool-playground') }));

  var lang = ws.lang === ws.defaultLang ? '' : util.format(',problem.%s.md', ws.lang);
  var pattern = '../exercises/*/{problem.md%s,kit/**/*}';
  var languaged = util.format(pattern, lang);
  var absolute = path.join(__dirname, languaged);
  var files = glob.sync(absolute).map(describe);
  var pkgfile = path.join(__dirname, '../package.json');

  files.unshift({
    src: pkgfile,
    dest: pkgfile.replace(root, './perfschool-playground'),
    tr: tr
  });

  contra.each(files, copy, done);

  function describe (src) {
    // workaround for windows
    var _root = root.replace(/\\/g, '/');
    var dest = src.replace(_root, '.').replace(rname, '/perfschool-playground/$1/').replace(/\//g, path.sep);
    mkdirp.sync(path.dirname(dest));
    return { src: src, dest: dest };
  }

  function tr (read, write) {
    read.pipe(ts(got)).pipe(write);
    function got (json, next) {
      var valid = ['express', 'serve-static']; // only those used in kits
      var pkg = JSON.parse(json);
      pkg.dependencies = _.pick(pkg.dependencies, valid);
      delete pkg.devDependencies;
      this.push(JSON.stringify(pkg, null, 2));
      next();
    }
  }

  function copy (data, next) {
    var write = fs.createWriteStream(data.dest);
    var read = fs.createReadStream(data.src);

    if (data.tr) {
      tr(read, write);
    } else {
      read.pipe(write);
    }
    read.on('end', next);
  }

  function done () {
    console.log(ws.__('init.cd-start', { target: chalk.red('./perfschool-playground') }) + '\n%s',
      chalk.yellow('cd perfschool-playground ; npm install ; perfschool')
    );
  }
}

module.exports = init;
