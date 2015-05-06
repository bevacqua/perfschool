'use strict';

var _ = require('lodash');

function t (context, next) {
  var g;
  var groups = [];
  var tests = [];
  return {
    group: group,
    groupend: groupend,
    pass: pass,
    fail: fail,
    fgroup: formatted(group),
    fpass: formatted(pass),
    ffail: formatted(fail),
    error: end,
    end: end
  };
  function group (name) {
    var existing = _.find(groups, { name: name });
    if (existing) {
      g = existing; return;
    }
    g = {
      group: true,
      pass: true,
      parent: g,
      name: name,
      tests: []
    };
    tests.push(g);
    groups.push(g);
  }
  function groupend () {
    g = g.parent;
  }
  function pass (message, passed) {
    var result = {
      message: message,
      pass: passed === void 0 || passed === true
    };
    if (g) {
      if (result.pass === false) {
        g.pass = false;
      }
      g.tests.push(result);
    } else {
      tests.push(result);
    }
  }
  function fail (message, failed) {
    pass(message, !(failed === void 0 || failed === true));
  }
  function parse (resource, formats) {
    return context.__(resource, formats);
  }
  function formatted (fn) {
    return function formatter (resource, formats, validity) {
      var hasFormats = typeof formats === 'object';
      var message = parse(resource, hasFormats ? formats : null);
      var valid = arguments.length === 3 ? validity : hasFormats ? void 0 : formats;
      fn(message, valid);
    };
  }
  function end (err) {
    next(err, tests);
  }
}

module.exports = t;
