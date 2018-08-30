const zlib = require('zlib');
const util = require('./util');

// Preprocess files to provide a gzip compressed alternative version
function Preprocesor(gzippedFilePaths, config, logger) {
  const log = logger.create('preprocessor.gzip');

  return (content, file, done) => {
    const originalSize = content.length;

    const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content);

    zlib.gzip(contentBuffer, (err, gzippedContent) => {
      if (err) {
        log.error(err);
        done(err);
        return;
      }

      gzippedFilePaths.push(file.path);

      log.info(`compressed ${file.originalPath} [${util.bytesToSize(originalSize)} -> ${util.bytesToSize(gzippedContent.length)}]`);
      done(null, gzippedContent);
    });
  };
}


// PUBLIC API
module.exports = Preprocesor;
