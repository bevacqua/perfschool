'use strict';

var factory = require('../../lib/factory');

module.exports = factory({
  verify: verify
});

function verify (res, next) {
  console.log(res.text)
  next(null, [
    {message:'Foo', passed: true},
    {message:'Bar',passed: true}
  ]);
}
