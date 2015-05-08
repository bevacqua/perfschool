'use strict';

var wat = require('workshopper-wat');
var exercise = wat({ verify: verify, endpoint: '/insights' });

module.exports = exercise;

function verify (t, req, res) {
  var json = read(res.body);
  var okay = typeof json === 'object';
  var fine = okay && !!json.resources;

  t.fgroup('main_group');
  t.fpass('status_ok', res.statusCode === 200);
  t.fpass('json_object', okay);
  t.fpass('prop', { key: 'resources' }, fine);
  t.fpass('prop', { key: 'resources.js' }, fine && typeof json.resources.js === 'number');
  t.fpass('prop', { key: 'resources.css' }, fine && typeof json.resources.css === 'number');
  t.fpass('prop', { key: 'resources.total' }, fine && typeof json.resources.total === 'number');
  t.fpass('prop', { key: 'resources.hosts' }, fine && typeof json.resources.hosts === 'number');
  t.end();
}

function read (data) {
  try {
    return JSON.parse(data);
  } catch (e) {
  }
}
