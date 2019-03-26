// Load wink-bm25-text-search
var bm25 = require( 'wink-bm25-text-search' );
// Create search engine's instance
var engine = bm25();
// Load NLP utilities
var nlp = require( 'wink-nlp-utils' );
// Load sample data (load any other JSON data instead of sample)
var docs = require( 'wink-bm25-text-search/sample-data/data-for-wink-bm25.json' );

// Step I: Define config
// Only field weights are required in this example.
engine.defineConfig( { fldWeights: { title: 4, body: 1, tags: 2 } } );

// Step II: Define PrepTasks
// Set up preparatory tasks for 'body' field
engine.definePrepTasks( [
  nlp.string.lowerCase,
  nlp.string.removeExtraSpaces,
  nlp.string.tokenize0,
  nlp.tokens.propagateNegations,
  nlp.tokens.removeWords,
  nlp.tokens.stem
], 'body' );
// Set up 'default' preparatory tasks i.e. for everything else
engine.definePrepTasks( [
  nlp.string.lowerCase,
  nlp.string.removeExtraSpaces,
  nlp.string.tokenize0,
  nlp.tokens.propagateNegations,
  nlp.tokens.stem
] );

// Step III: Add Docs
// Add documents now...
docs.forEach( function ( doc, i ) {
  // Note, 'i' becomes the unique id for 'doc'
  engine.addDoc( doc, i );
} );

// Step IV: Consolidate
// Consolidate before searching
engine.consolidate();

// All set, start searching!
var results = engine.search( 'who is married to barack' );
// results is an array of [ doc-id, score ], sorted by score
// results[ 0 ][ 0 ] i.e. the top result is:
console.log( docs[ results[ 0 ][ 0 ] ] );
// -> Michelle LaVaughn Robinson Obama (born January 17, 1964) is...

window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search').addEventListener('keyup', function (el) {
      var results = engine.search(el.target.value);
      if ( results.length < 1 ) return false;
      var result = docs[results[0][0]];
      document.getElementById('title').innerText = result.title;
      document.getElementById('body').innerText = result.body;
    })
});
