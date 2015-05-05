'use strict';

function randomPort () {
  return 1024 + Math.floor(Math.random() * 64511);
}

module.exports = randomPort;
