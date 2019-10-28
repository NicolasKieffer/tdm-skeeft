/**
 * @prettier
 */
'use strict';

/* Module Require */

/* Module Require */
const Indexator = require('../../../src/indexator.js'),
  Matrix = require('../../../src/matrix.js'),
  math = require('mathjs'),
  fs = require('fs');

let matrix = new Matrix();

/**
 * Wrapper of functions :
 */
const wrappers = {};

/**
 * - indexator
 *   - index()
 *   - summatize()
 */

wrappers.indexator = {
  'index': function(fn, item, cb) {
    fs.readFile(item.arguments.path, 'utf-8', function(err, res) {
      if (err) throw err;
      const result = fn(res, item.arguments.selectors, item.arguments.criteria);
      return cb(Object.keys(result));
    });
  },
  'summarize': function(fn, item, cb) {
    fs.readFile(item.arguments.path, 'utf-8', function(err, res) {
      if (err) throw err;
      let indexator = new Indexator();
      const result = fn(
        res,
        item.arguments.selectors,
        indexator.index(res, item.arguments.selectors, item.arguments.criteria),
        item.arguments.delimiter
      );
      return cb(result);
    });
  }
};

/**
 * - matrix
 *   - init()
 *   - fill()
 *   - stats()
 *   - select()
 *   - sort()
 *   - compare()
 */
wrappers.matrix = {
  'init': function(fn, item, cb) {
    let result = matrix.init(item.arguments.indexations, item.arguments.selectors);
    return cb(Object.keys(matrix.mapping));
  },
  'fill': function(fn, item, cb) {
    const result = matrix.fill(item.arguments.criteria);
    return cb(result.toString());
  },
  'stats': function(fn, item, cb) {
    const result = matrix.stats(math.matrix(item.arguments.m));
    return cb(JSON.stringify(result));
  },
  'select': function(fn, item, cb) {
    item.arguments.stats.FR = math.matrix(item.arguments.stats.FR);
    item.arguments.stats.FP = math.matrix(item.arguments.stats.FP);
    item.arguments.stats.FF = math.matrix(item.arguments.stats.FF);
    const result = matrix.select(item.arguments.stats, item.arguments.boost);
    return cb(Object.keys(result).toString());
  },
  'sort': function(fn, item, cb) {
    let result = [];
    fn(item.arguments.terms).map(function(el, i) {
      result.push(el.term);
    });
    return cb(result.toString());
  },
  'compare': function(fn, item, cb) {
    return cb(fn(item.arguments.a, item.arguments.b));
  }
};

module.exports = wrappers;
