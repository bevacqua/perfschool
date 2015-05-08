'use strict';

var wat = require('workshopper-wat');
var exercise = wat({ verify: verify, endpoint: '/test', piped: true });

module.exports = exercise;

function verify (t, req, res) {
  var json = read(res.body);
  var okay = typeof json === 'object';
  var fine = okay && !!json.timing;

  t.fgroup('main_group');
  t.fpass('status_ok', res.statusCode === 200);
  t.fpass('json_object', okay);
  t.fpass('prop', { key: 'timing' }, fine);
  t.fpass('prop', { key: 'timing.ttfb' }, fine && typeof json.timing.ttfb === 'number');
  t.fpass('prop', { key: 'timing.speedIndex' }, fine && typeof json.timing.speedIndex === 'number');
  t.fpass('prop', { key: 'timing.domLoaded' }, fine && typeof json.timing.domLoaded === 'number');
  t.end();
}

function read (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
  }
}
