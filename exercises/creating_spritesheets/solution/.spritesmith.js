'use strict';

var util = require('util');

module.exports = {
  src: 'icons/*',
  destImage: 'icons.png',
  destCSS: 'icons.css',
  cssOpts: {
    cssClass: function (item) {
      return util.format('.ic-%s:before', item.name);
    }
  }
};
