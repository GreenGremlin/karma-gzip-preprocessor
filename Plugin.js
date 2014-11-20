var path = require('path');

var log = null;
var compressedFiles = [];
var servedFiles = [];

function Plugin(emitter, logger, customFileHandlers) {
  log = logger.create('gzip-plugin');

  customFileHandlers.push({
    urlRegex: /.*.gz(\?[a-z0-9]*)?$/,
    handler: responseHandler
  });

  emitter.on('file_list_modified', function(filesPromise) {
    filesPromise.then(function(files) {
      files.included.forEach(function(file) {
        if (path.extname(file.path) === '.gz') {
          compressedFiles[path.basename(file.path)] = file;
        } else {
          servedFiles.push(file);
        }
      });
      files.served = servedFiles;
    });
  });
};

// Response handler for gzip encoded files
function responseHandler(request, response) {
  var url = request.url.substr(1);
  var urlBasename = path.basename(url).split('?')[0];
  var file = compressedFiles[urlBasename];

  if (clientAcceptsGzipEncoding(request)) {
    log.debug('serving (gzip): ' + file.path)
    setGzipResponseheaders(response);
    response.writeHead(200);
    response.end(file.content);
  } else {
    // TODO: fix this — fall back to non-gzipped response
    log.error('CLIENT DOES NOT ACCEPT GZIPPED REPSONSES')
    throw new Error()
  };
};

// Set Gzip headers on the response
function setGzipResponseheaders(response) {
  // var type = mime.lookup(file.originalPath);
  // var charset = mime.charsets.lookup(type);

  response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  response.setHeader('Content-Encoding', 'gzip');
  response.setHeader('Vary', 'Accept-Encoding');
};

// check if the client accepts gzipped responses
function clientAcceptsGzipEncoding(request) {
  // TODO: request.getHeader ???
  return request.headers['accept-encoding'].indexOf('gzip') !== -1
};


// PUBLIC API
module.exports = Plugin;
