'use strict';

var _ = require('lodash');
var util = require('util');
var request = require('request');
var exercise = require('workshopper-exercise');
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var randomPort = require('./randomPort');

function factory (options) {
  var context = exercise();
  filecheck(context);
  execute(context);
  context.addSetup(setup);
  context.addProcessor(processor);
  return context;

  function setup (mode, next) {
    context.submissionPort = randomPort();
    context.submissionArgs = [context.submissionPort];
    next();
  }

  function processor (mode, next) {
    setTimeout(verify, 500); // wait for server to listen

    function verify () {
      var url = 'http://localhost:' + context.submissionPort;

      request(url, responded);

      function responded (err, res) {
        if (err) {
          error(context.__('fail.connection', { code: err.code, url: url })); return;
        }
        if (!options.verify) {
          error(context.__('fail.unverified')); return;
        }
        options.verify(res, verified);
      }

      function verified (err, tests) {
        if (err) {
          error(err.stack || err); return;
        }
        tests.forEach(print);
        next(null, _.all(tests, 'passed'));
      }

      function print (test) {
        context.emit(test.passed ? 'pass' : 'fail', test.message);
      }

      function error (message) {
        context.emit('fail', message);
        next(null, false);
      }
    }
  }
}

module.exports = factory;
