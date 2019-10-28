# tdm-skeeft

**tdm-skeeft** is a tdm module for terme exctraction of structured text. It can be used to get keywords (or summary) of document.

## Installation

Using npm :

```shell
$ npm i -g tdm-skeeft
$ npm i --save tdm-skeeft
```

Using Node :

```js
/* require of Skeeft module */
const Skeeft = require('tdm-skeeft');

/* Build new Instance of Matrix */
let matrix = new Skeeft.Matrix();

/* Build new Instance of Indexator */
let indexator = new Skeeft.Indexator();
```

## Launch tests

```shell
$ npm run test
```

## Build documentation

```shell
$ npm run docs
```

## API Documentation

## Classes

<dl>
<dt><a href="#Indexator">Indexator</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#Matrix">Matrix(options)</a></dt>
<dd><p>Constructor</p>
</dd>
</dl>

<a name="Indexator"></a>

## Indexator
**Kind**: global class  

* [Indexator](#Indexator)
    * [new Indexator([options])](#new_Indexator_new)
    * [.summarize(xmlString, selectors, indexation, delimiter)](#Indexator+summarize) ⇒ <code>Array</code>
    * [.index(xmlString, selectors, criterion)](#Indexator+index) ⇒ <code>Array</code>

<a name="new_Indexator_new"></a>

### new Indexator([options])
**Returns**: [<code>Indexator</code>](#Indexator) - - An instance of Indexator  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | Options of constructor |
| [options.filters] | <code>Object</code> | Filters options given to title & fulltext extractors |
| [options.filters.title] | <code>Filter</code> | Options given to extractor of title |
| [options.filters.fulltext] | <code>Filter</code> | Options given to extractor of fulltext |
| [options.stopwords] | <code>Object</code> | Stopwords |
| [options.dictionary] | <code>Object</code> | Dictionnary |

**Example** *(Example usage of &#x27;contructor&#x27; (with paramters))*  
```js
let options = {
    'filters': {
      'title' : customTitleFilter, // According customTitleFilter contain your custom settings
      'fulltext' : customFulltextFilter, // According customFulltextFilter contain your custom settings
    },
    'dictionary': myDictionary, // According myDictionary contain your custom settings
    'stopwords': myStopwords // According myStopwords contain your custom settings
  },
  indexator = new Indexator(options);
// returns an instance of Indexator with custom options
```
**Example** *(Example usage of &#x27;contructor&#x27; (with default values))*  
```js
let indexator = new Indexator();
// returns an instance of Indexator with default options
```
<a name="Indexator+summarize"></a>

### indexator.summarize(xmlString, selectors, indexation, delimiter) ⇒ <code>Array</code>
Summarize a fulltext

**Kind**: instance method of [<code>Indexator</code>](#Indexator)  
**Returns**: <code>Array</code> - List of extracted sentences (representative summary)  

| Param | Type | Description |
| --- | --- | --- |
| xmlString | <code>String</code> | Fulltext (XML formated string) |
| selectors | <code>Object</code> | Used selectors |
| selectors.title | <code>String</code> | Used selectors |
| selectors.title | <code>Object</code> | Used selectors |
| indexation | <code>Object</code> | Indexation of xmlString |
| delimiter | <code>RegExp</code> | Delimiter used to split text into sentences |

**Example** *(Example usage of &#x27;summarize&#x27; function)*  
```js
let indexator = new Indexator();
indexator.summarize(xmlString, {'title' :'title', 'segments': ['paragraph1', 'paragraph2']}, indexator.index(xmlString)); // return an ordered Array of Object [{...}, {...}]
```
<a name="Indexator+index"></a>

### indexator.index(xmlString, selectors, criterion) ⇒ <code>Array</code>
Index a fulltext

**Kind**: instance method of [<code>Indexator</code>](#Indexator)  
**Returns**: <code>Array</code> - List of extracted keywords  

| Param | Type | Description |
| --- | --- | --- |
| xmlString | <code>String</code> | Fulltext (XML formated string) |
| selectors | <code>Object</code> | Used selectors |
| criterion | <code>String</code> | Criterion used (sort) |

**Example** *(Example usage of &#x27;index&#x27; function)*  
```js
let indexator = new Indexator();
indexator.index(xmlString, {'title' :'title', 'segments': ['paragraph1', 'paragraph2']}); // return an ordered Array of Object [{...}, {...}]
```
<a name="Matrix"></a>

## Matrix(options)
Constructor

**Kind**: global function  
**Returnsthis**:   

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options of constructor |

**Example** *(Example usage of &#x27;contructor&#x27; (with paramters))*  
```js
let options = {
    'boost': 20
  },
  matrix = new Matrix(options);
// returns an instance of Matrix with custom options
```
**Example** *(Example usage of &#x27;contructor&#x27; (with default values))*  
```js
let matrix = new Matrix();
// returns an instance of Matrix with default options
```

* [Matrix(options)](#Matrix)
    * _instance_
        * [.init(indexations, selectors)](#Matrix+init)
        * [.fill(criterion)](#Matrix+fill)
        * [.stats(m)](#Matrix+stats)
        * [.select(stats, boost, criterion)](#Matrix+select)
    * _static_
        * [.sort(terms, compare)](#Matrix.sort)
        * [.compare(a, b)](#Matrix.compare)

<a name="Matrix+init"></a>

### matrix.init(indexations, selectors)
Init each values of this object

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns{object}**: Return 'this' reference  

| Param | Type | Description |
| --- | --- | --- |
| indexations | <code>Array</code> | Array filled with indexations of each segments |
| selectors | <code>Array</code> | Array filled with each segment's name |

<a name="Matrix+fill"></a>

### matrix.fill(criterion)
Fill a matrix with values of choosen criterion

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns{matrix}**: Return a mathsjs matrix filled with values (and )  

| Param | Type | Description |
| --- | --- | --- |
| criterion | <code>string</code> | Key of term object |

<a name="Matrix+stats"></a>

### matrix.stats(m)
Calcul some statistics

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns{object}**: Return an object with some statistcs :  - FR (rappel d’étiquetage),  - FP (précision d’étiquetage),  - FF (F-mesure d’étiquetage),  - rowsFF (nb of terms for each rows of FF matrix),  - colsFF (nb of terms for each columns of FF matrix),  - mFF (mean of FF)  

| Param | Type | Description |
| --- | --- | --- |
| m | [<code>Matrix</code>](#Matrix) | Matrix (mathjs.matrix()) |

<a name="Matrix+select"></a>

### matrix.select(stats, boost, criterion)
Select terms

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns{object}**: Return an object with selected terms  

| Param | Type | Description |
| --- | --- | --- |
| stats | <code>Object</code> | Statistics of Text (result of Matrix.stats()) |
| boost | <code>Object</code> | List of boosted terms (Object with key = term) |
| criterion | <code>String</code> | Criterion used by skeeft (frequency or specificity) |

<a name="Matrix.sort"></a>

### Matrix.sort(terms, compare)
Sort all terms with the 'compare' function

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns{array}**: Return the array of sorted terms  

| Param | Type | Description |
| --- | --- | --- |
| terms | <code>Object</code> | List of terms |
| compare | <code>function</code> | Compare function |

<a name="Matrix.compare"></a>

### Matrix.compare(a, b)
Compare two elements depending of its factor

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns{integer}**: return 1, -1 or 0  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | First object |
| b | <code>Object</code> | Second object |

