'use strict';

var util = require('util');
var through2 = require('through2');
var superagent = require('superagent');
var bl = require('bl');
var exercise = require('workshopper-exercise');
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var randomPort = require('./randomPort');

function factory () {
  var context = exercise();
  filecheck(context);
  execute(context);
  context.addSetup(setup);
  context.addProcessor(listener);
  return context;

  function setup (mode, next) {
    context.submissionPort = randomPort();
    context.solutionPort = context.submissionPort + 1;

    context.submissionArgs = [context.submissionPort];
    context.solutionArgs = [context.solutionPort];

    next();
  }

  function listener (mode, next) {
    context.submissionStdout.pipe(process.stdout);
    context.submissionStdout = through2();

    if (mode === 'verify') {
      context.solutionStdout = through2();
    }

    setTimeout(query, 500); // wait for server to listen
    next(null, true);

    function query () {
      verify(context.submissionPort, context.submissionStdout);

      if (mode === 'verify') {
        verify(context.solutionPort, context.solutionStdout);
      }

      function verify (port, stream) {
        var url = 'http://localhost:' + port;

        superagent
          .get(url)
          .on('error', error)
          .pipe(bl(writer));

        function writer (err, data) {
          if (err) {
            stream.emit('error', err); return;
          }
          stream.write(data.toString() + '\n');
          stream.end();
        }

        function error (err) {
          context.emit('fail', context.__('fail.connection', { code: err.code, url: url }));
        }
      }
    }
  }
}

module.exports = factory;
