'use strict';

var ffol = require('fontfaceonload');
var html = document.documentElement;

watch('Lato');
watch('Cardo');
watch('Roboto');
watch('Merriweather');

function watch (family) {
  ffol(family, { success: loaded });

  function loaded () {
    html.className += ' ok-' + family
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/--/g, '-')
      .replace(/^-|-$/g, '');
  }
}
