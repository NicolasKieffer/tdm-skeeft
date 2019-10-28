/**
 * @prettier
 */
'use strict';

/* Module Require */
const utils = require('tdm-utils'),
  Matrix = require('./src/matrix.js'),
  Indexator = require('./src/indexator.js');

const Skeeft = {
  /* Constructor of Matrix */
  'Matrix': Matrix,
  /* Constructor of Indexator */
  'Indexator': Indexator
};

module.exports = Skeeft;
