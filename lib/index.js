var Plugin = require('./Plugin');
var Preprocessor = require('./Preprocessor');

Plugin.$inject = ['gzippedFilePaths', 'emitter', 'logger', 'customFileHandlers', 'config.basePath'];
Preprocessor.$inject = ['gzippedFilePaths', 'config.gzip', 'logger', 'helper'];

module.exports = {
  'gzippedFilePaths': ['value', []],
  'framework:gzip': ['factory', Plugin],
  'preprocessor:gzip': ['factory', Preprocessor]
};
