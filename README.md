# karma-gzip-preprocessor [![NPM version](https://badge.fury.io/js/karma-gzip-preprocessor.svg)](http://badge.fury.io/js/karma-gzip-preprocessor)

**A Karma preprocessor for compressing test assets.**

Particularly handy when working with large test bundles and remote browser-cloud services like Browserstack or Saucelabs.

### Installation

```
npm install karma-gzip-preprocessor --save-dev
```

### Requirements

Since karma-gzip-preprocessor has a minimum requirement of karma v3.1.0.

**For older versions of karma**, see the [README for karma-gzip v2](https://github.com/GreenGremlin/karma-gzip-preprocessor/tree/v2.0.1).

### Configuration

To enable gzip compression, all you need to do is add `gzip` as a preprocessor in your karma config.

``` js
// karma.conf.js
module.exports = function(config) {
  config.set({
    files: [
      'src/**/*.test.js'
    ],
    // The plugins config property is optional, but if it is included it must include 'karma-gzip-preprocessor'
    plugins: [
      'karma-gzip-preprocessor',
    ],
    preprocessors: {
      'src/**/*.js': ['gzip'],
      // The `gzip` preprocessor should always be the last preprocessor
      '*.coffee': ['coffee', 'gzip'],
    },
  });
};
```

Verify your assets are gzipped when you see output simmilar to the following:

``` shell
$ karma start

INFO [preprocessor.gzip]: compressed /MyProject/src/polyfills.js [2MB -> 437KB]
INFO [preprocessor.gzip]: compressed /MyProject/src/index.test.js [5MB -> 1MB]
```

### License

MIT (http://www.opensource.org/licenses/mit-license.php)
