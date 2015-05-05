#!/usr/bin/env node

'use strict';

var workshopper = require('workshopper');
var path = require('path');

workshopper({
  name: 'perfschool',
  title: '#perfschool',
  appDir: __dirname,
  menu: { bg: 'red' },
  menuItems: [],
  languages : ['en'],
  exerciseDir: path.join(__dirname, './exercises/')
});
