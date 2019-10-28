/**
 * @prettier
 */
'use strict';

/* Module Require */
const utils = require('tdm-utils'),
  Matrix = require('./matrix.js'),
  Teeft = require('tdm-teeft');

/**
 * @constructs Indexator
 * @example <caption>Example usage of 'contructor' (with paramters)</caption>
 * let options = {
 *     'filters': {
 *       'title' : customTitleFilter, // According customTitleFilter contain your custom settings
 *       'fulltext' : customFulltextFilter, // According customFulltextFilter contain your custom settings
 *     },
 *     'dictionary': myDictionary, // According myDictionary contain your custom settings
 *     'stopwords': myStopwords // According myStopwords contain your custom settings
 *   },
 *   indexator = new Indexator(options);
 * // returns an instance of Indexator with custom options
 * @example <caption>Example usage of 'contructor' (with default values)</caption>
 * let indexator = new Indexator();
 * // returns an instance of Indexator with default options
 * @param {Object} [options] - Options of constructor
 * @param {Object} [options.filters] - Filters options given to title & fulltext extractors
 * @param {Filter} [options.filters.title] - Options given to extractor of title
 * @param {Filter} [options.filters.fulltext] - Options given to extractor of fulltext
 * @param {Object} [options.stopwords] - Stopwords
 * @param {Object} [options.dictionary] - Dictionnary
 * @returns {Indexator} - An instance of Indexator
 */
const Indexator = function(options) {
  // Default values
  const DEFAULT = {
    'filters': {
      'title': null,
      'fulltext': null
    },
    'dictionary': {},
    'stopwords': {}
  };
  this.teeft = {
    'title': new Teeft.Indexator({
      'filter': options && options.filters && options.filters.title ? options.filters.title : DEFAULT.filters.title,
      'dictionary': options && options.dictionary ? options.dictionary : DEFAULT.dictionary,
      'stopwords': options && options.stopwords ? options.stopwords : DEFAULT.stopwords
    }),
    'fulltext': new Teeft.Indexator({
      'filter':
        options && options.filters && options.filters.fulltext ? options.filters.fulltext : DEFAULT.filters.fulltext,
      'dictionary': options && options.dictionary ? options.dictionary : DEFAULT.dictionary,
      'stopwords': options && options.stopwords ? options.stopwords : DEFAULT.stopwords
    })
  };
  this.filters = {
    'title': this.teeft.title.extractor.filter,
    'fulltext': this.teeft.fulltext.extractor.filter
  };
  return this;
};

/* Static const */
Indexator.statistics = {
  'frequency': 'frequency',
  'specificity': 'specificity',
  'probability': 'probability'
};

/**
 * Summarize a fulltext
 * @example <caption>Example usage of 'summarize' function</caption>
 * let indexator = new Indexator();
 * indexator.summarize(xmlString, {'title' :'title', 'segments': ['paragraph1', 'paragraph2']}, indexator.index(xmlString)); // return an ordered Array of Object [{...}, {...}]
 * @param {String} xmlString Fulltext (XML formated string)
 * @param {Object} selectors Used selectors
 * @param {String} selectors.title Used selectors
 * @param {Object} selectors.title Used selectors
 * @param {Object} indexation Indexation of xmlString
 * @param {RegExp} delimiter Delimiter used to split text into sentences
 * @returns {Array} List of extracted sentences (representative summary)
 */
Indexator.prototype.summarize = function(xmlString, selectors, indexation, delimiter = '.') {
  // reference to this
  const self = this,
    result = [],
    factors = {}, // contains score of all keywords (indexed by skeeft)
    $ = utils.XML.raw(xmlString),
    titleWords = self.teeft.title.index($(selectors.title).text(), {
      'truncate': false,
      'sort': false
    }).extraction.keys, // Get keywords in title (weighting)
    lines = selectors.segments
      .map(function(el, i) {
        return $(el)
          .map(function(j, e) {
            return $(e)
              .text()
              .split(delimiter)
              .map(function(k, f) {
                if (k.length > 0)
                  return {
                    'text': k,
                    'location': parseInt([i, j, f].join('')),
                    'keywords': self.teeft.fulltext.index(k, {
                      'truncate': false,
                      'sort': false
                    }).extraction.keys
                  };
              });
          })
          .get();
      })
      .reduce(function(acc, cur) {
        return acc.concat(cur);
      }, []); // Get keywords for each lines

  if (!Array.isArray(indexation) || indexation.length === 0) return result;
  // Create the factors dictionary
  for (let i = 0; i < indexation.length; i++) {
    factors[indexation[i].term] = indexation[i].factor;
  }
  // Set factor of each lines
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line) {
      line.factor = 0;
      if (line.keywords) {
        for (let j = 0; j < line.keywords.length; j++) {
          line.factor += factors[line.keywords[j]] ? factors[line.keywords[j]] : 0;
        }
      }
      result.push(line);
    }
  }
  // Sort result
  result.sort(Matrix.compare);
  // Select representatives sentences
  let current = 0,
    last = 0,
    delta = 0.05; // 5%
  for (let i = 0; i < result.length - 2; i++) {
    last = result[i].factor;
    current = result[i + 1].factor;
    // console.log(last / current);
  }
  let tmp = [];
  for (let i = 0; i < 12; i++) {
    tmp.push(result[i]);
  }
  tmp.sort(function(a, b) {
    if (a.location < b.location) return -1;
    else if (a.location > b.location) return 1;
    else return 0;
  });

  return result;
};

/**
 * Index a fulltext
 * @example <caption>Example usage of 'index' function</caption>
 * let indexator = new Indexator();
 * indexator.index(xmlString, {'title' :'title', 'segments': ['paragraph1', 'paragraph2']}); // return an ordered Array of Object [{...}, {...}]
 * @param {String} xmlString Fulltext (XML formated string)
 * @param {Object} selectors Used selectors
 * @param {String} criterion Criterion used (sort)
 * @returns {Array} List of extracted keywords
 */
Indexator.prototype.index = function(xmlString, selectors, criterion = Indexator.statistics.frequency) {
  // reference to this
  const self = this,
    $ = utils.XML.raw(xmlString),
    _selectors = {
      'title': selectors.title,
      'segments': {}
    },
    titleWords = self.teeft.title.index($(selectors.title).text(), {
      'truncate': false,
      'sort': false
    }).extraction.terms, // Get keywords in title (weighting)
    indexations = selectors.segments.map(function(el, i) {
      return $(el)
        .map(function(j, e) {
          return self.teeft.fulltext.index($(e).text(), {
            'truncate': false,
            'sort': false
          });
        })
        .get();
    }), // Get keywords for each parts of fulltext
    data = indexations
      .map(function(e, i) {
        return e
          .map(function(f, j) {
            return f.keywords.map(function(g, k) {
              const key = selectors.segments[i] + (e.length > 1 ? ':nth-child(' + (j + 1) + ')' : ''), // If there is more than one element, create an unique selector
                cp = Object.assign(
                  {
                    segment: key
                  },
                  g
                );
              _selectors.segments[key] = true;
              return cp;
            });
          })
          .reduce(function(acc, cur) {
            return acc.concat(cur);
          }, []);
      })
      .reduce(function(acc, cur) {
        return acc.concat(cur);
      }, []), // Regroup keywords
    m = new Matrix(); // Matrix of text representation
  _selectors.segments = Object.keys(_selectors.segments);
  m.init(data, _selectors);
  const filled = m.fill(Indexator.statistics[criterion]),
    stats = m.stats(filled),
    select = m.select(stats, titleWords, Indexator.statistics[criterion]),
    sorted = Matrix.sort(select);
  return sorted;
};

module.exports = Indexator;
