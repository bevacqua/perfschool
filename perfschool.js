#!/usr/bin/env node

'use strict';

var workshopper = require('workshopper');
var path = require('path');
var init = require('./lib/init');

workshopper({
  name: 'perfschool',
  title: '#perfschool',
  appDir: __dirname,
  menu: { bg: 'red' },
  menuItems: [],
  languages : ['en'],
  exerciseDir: solve('./exercises/'),
  helpFile: solve('./i18n/help/{lang}.md'),
  commands: [{ name: 'init', handler: init }]
});

function solve (file) {
  return path.join(__dirname, file);
}
