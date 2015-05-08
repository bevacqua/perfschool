'use strict';

var wat = require('workshopper-wat');
var exercise = wat({
  verify: verify,
  endpoint: '/cats',
  requestOptions: {
    qs: {
      amount: randomAmountOfCats()
    }
  }
});

module.exports = exercise;

function randomAmountOfCats () {
  return Math.floor(Math.random() * 25) + 4;
}

function verify (t, req, res) {
  t.end();
}
