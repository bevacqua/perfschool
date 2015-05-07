'use strict';

var localtunnel = require('localtunnel');

function tunnel (port, done) {
  localtunnel(port, tunneled);
  function tunneled (err, tunnel) {
    done(err, tunnel && tunnel.url);
  }
}

module.exports = tunnel;
