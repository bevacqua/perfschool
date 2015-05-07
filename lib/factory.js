'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var contra = require('contra');
var util = require('util');
var msee = require('msee');
var chalk = require('chalk');
var request = require('request');
var exercise = require('workshopper-exercise');
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var randomPort = require('./randomPort');
var t = require('./t');

function factory (options) {
  var context = exercise();
  filecheck(context);
  execute(context);
  context.addSetup(setup);
  context.addProcessor(processor);
  context.getSolutionFiles = renderSolution;
  return context;

  function setup (mode, done) {
    context.submissionPort = randomPort();
    context.submissionArgs = [context.submissionPort];
    done();
  }

  function processor (mode, done) {
    if (options.piped === true) {
      context.submissionStdout.pipe(process.stdout);
    }

    setTimeout(verify, 500); // wait for server to listen

    function verify () {
      var port = context.submissionPort;
      var url = util.format('http://localhost:%s%s', port, options.endpoint || '');

      request(url, responded);

      function responded (err, res) {
        if (err) {
          error(context.__('fail.connection', { code: err.code, url: url })); return;
        }
        if (!options.verify) {
          error(context.__('fail.unverified')); return;
        }
        var req = {
          url: url,
          port: port
        };
        options.verify(t(context, verified), req, res);
      }

      function verified (err, tests) {
        if (err) {
          error(err.stack || err); return;
        }
        tests.forEach(log);
        done(null, _.all(tests, 'pass'));
      }

      function log (test) {
        if (test.group) {
          if (test.tests.length) { // otherwise omit heading
            console.log('\n' + chalk.magenta('# ' + test.name));
            test.tests.forEach(log);
          }
        } else {
          context.emit(test.pass ? 'pass' : 'fail', test.message);
        }
      }

      function error (message) {
        context.emit('fail', message);
        done(null, false);
      }
    }
  }

  function lookupSolutionFile (done) {
    var uncheckedFiles = [
      'solution.' + context.lang + '.md',
      'solution.' + context.lang + '.txt',
      'solution.md',
      'solution.txt',
      'solution.' + context.defaultLang + '.md',
      'solution.' + context.defaultLang + '.txt'
    ];
    next();
    function next () {
      var filename = uncheckedFiles.shift();
      if (!filename) {
        done(null, ''); return;
      }
      var file = path.resolve(context.dir, filename);
      fs.exists(file, existed);
      function existed (exists) {
        if (!exists) {
          next(); return;
        }
        fs.stat(file, stated);
      }
      function stated (err, stat) {
        if (err) {
          done(err); return;
        }
        if (stat.isFile()) {
          done(null, file); return;
        }
        next();
      }
    }
  }

  function renderSolution (done) {
    contra.waterfall([contra.curry(lookupSolutionFile), read, log], done);
    function read (file, next) {
      fs.readFile(file, 'utf8', next);
    }
    function log (content, next) {
      console.log(msee.parse(content).replace(/\n+$/, '\n'));
      next(null, []);
    }
  }
}

module.exports = factory;
