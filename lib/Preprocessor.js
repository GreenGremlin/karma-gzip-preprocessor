var zlib = require('zlib');
var util = require('./util');

// Proprocess files to provide a gzip compressed alternative version
function Preprocesor(gzippedFilePaths, config, logger, helper) {
  var log = logger.create('preprocessor.gzip');

  var transformPath = function(filepath) {
    return filepath.concat('.gz');
  };

  return function(content, file, done) {
    var originalSize = content.length;

    if(!Buffer.isBuffer(content)) {
      content = new Buffer(content, 'utf-8');
    }

    zlib.gzip(content, function(err, gzippedContent) {
      if (err) {
        log.error(err);
        return done(err);
      }

      gzippedFilePaths.push(file.path);

      log.info('compressed ' + file.originalPath + ' [' + util.bytesToSize(originalSize) + ' -> ' + util.bytesToSize(gzippedContent.length) + ']');
      done(null, gzippedContent);
    });
  };
}


// PUBLIC API
module.exports = Preprocesor;
