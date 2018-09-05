const zlib = require('zlib');
const util = require('./util');

// Preprocess files to provide a gzip compressed alternative version
function Preprocessor(config, logger) {
  const log = logger.create('preprocessor.gzip');

  return (content, file, done) => {
    const originalSize = content.length;
    // const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content);

    zlib.gzip(content, (err, gzippedContent) => {
      if (err) {
        log.error(err);
        done(err);
        return;
      }

      // eslint-disable-next-line no-param-reassign
      file.encodings.gzip = gzippedContent;

      log.info(`compressed ${file.originalPath} [${util.bytesToSize(originalSize)} -> ${util.bytesToSize(gzippedContent.length)}]`);
      done(null, content);
    });
  };
}

Preprocessor.$inject = ['config.gzip', 'logger'];

module.exports = Preprocessor;
