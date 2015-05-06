'use strict';

var _ = require('lodash');
var util = require('util');
var superagent = require('superagent');
var exercise = require('workshopper-exercise');
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var randomPort = require('./randomPort');

function factory (options) {
  var context = exercise();
  filecheck(context);
  execute(context);
  context.addSetup(setup);
  context.addProcessor(listener);
  return context;

  function setup (mode, next) {
    context.submissionPort = randomPort();
    context.submissionArgs = [context.submissionPort];
    next();
  }

  function listener (mode, next) {
    setTimeout(query, 500); // wait for server to listen

    function query () {
      verify(context.submissionPort);

      function verify (port, stream) {
        var url = 'http://localhost:' + port;

        superagent
          .get(url)
          .on('error', error)
          .end(response);

        function response (err, res) {
          if (err) {
            throw err;
          }
          if (options.verify) {
            options.verify(res, verified);
          } else {
            context.emit('fail', context.__('fail.unverified'));
            next(null, false);
          }
        }

        function verified (err, tests) {
          if (err) {
            throw err;
          }
          tests.forEach(print);
          next(null, _.all(tests, 'passed'));
        }

        function print (test) {
          context.emit(test.passed ? 'pass' : 'fail', test.message);
        }

        function error (err) {
          context.emit('fail', context.__('fail.connection', { code: err.code, url: url }));
        }
      }
    }
  }
}

module.exports = factory;
