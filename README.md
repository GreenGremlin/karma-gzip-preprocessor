# karma-gzip

A Karma preprocessor and server handler for serving gzipped test assets. Particularly handy when working with large test bundles and remote browser-cloud services like Browserstack or Saucelabs.

### Installation

The easiest way is to keep karma-coverage as a devDependency in your package.json.

```
npm install karma-gzip --save-dev
```

### Configuration

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    // We need to add some extra server middleware so that we can correctly
    // serve gzipped files
    frameworks: [ 'gzip' ],
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],

    preprocessors: {
      // Only files marked for gzip preprocessing will be compressed.  
      'test/large_test_bundle.js': [ 'gzip' ],
      'test/test_helper.coffee': [ 'coffee', 'gzip' ]
    }
  });
};
```

You can tell that your assets are being gzipped when you see output something like the following:

``` shell
$ karma start --log-level=debug

INFO [preprocessor.gzip]: compressed /MyProject/test/test_helper.js [2MB -> 437KB]
INFO [preprocessor.gzip]: compressed /MyProject/test/test_index.js [5MB -> 1MB]
DEBUG [gzip-plugin]: serving (gzip): /MyProject/test/test_helper.js
DEBUG [gzip-plugin]: serving (gzip): /MyProject/test/test_index.js
```
