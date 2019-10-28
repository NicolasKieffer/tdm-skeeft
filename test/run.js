/**
 * @prettier
 */
'use strict';

/* Module Require */
const pkg = require('../package.json'),
  Skeeft = require('../src/indexator.js'),
  Matrix = require('../src/matrix.js'),
  fs = require('fs'),
  TU = require('auto-tu');

// Test data
const dataset = {
  'indexator': require('./dataset/in/data/indexator.json'),
  'matrix': require('./dataset/in/data/matrix.json')
};

// Map of functions used in test
const wrapper = require('./dataset/in/wrapper.js');

// Tested object (only functions are "automatically" tested)
const myObject = {
  'indexator': new Skeeft(),
  'matrix': new Matrix()
};

/**
 * Start test
 */

TU.start({
  'description': pkg.name + '/index.js',
  'root': 'Skeeft',
  'object': myObject,
  'dataset': dataset,
  'wrapper': wrapper
});
