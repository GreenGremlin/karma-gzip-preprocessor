var path = require('path');

var log = null;
var compressedFiles = Object.create(null);

function updateFiles(files, gzippedFiles) {
  var webserverFiles = [];

  files.included.forEach(function(file) {
    if (gzippedFiles.indexOf(file.path) !== -1) {
      compressedFiles[path.basename(file.path)] = file;
    } else {
      webserverFiles.push(file);
    }
  });

  files.served = webserverFiles;
}

// Set Gzip headers on the response
function setGzipResponseheaders(response) {
  // var type = mime.lookup(file.originalPath);
  // var charset = mime.charsets.lookup(type);

  response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  response.setHeader('Content-Encoding', 'gzip');
  response.setHeader('Vary', 'Accept-Encoding');
}

// check if the client accepts gzipped responses
function clientAcceptsGzipEncoding(request) {
  // TODO: request.getHeader ???
  return request.headers['accept-encoding'].indexOf('gzip') !== -1;
}

// Response handler for gzip encoded files
function responseHandler(request, response) {
  var url = request.url.substr(1);
  var urlBasename = path.basename(url).split('?')[0];
  var file = compressedFiles[urlBasename];

  if (clientAcceptsGzipEncoding(request)) {
    log.debug('serving (gzip): ' + file.path);
    setGzipResponseheaders(response);
    response.writeHead(200);
    response.end(file.content);
  } else {
    // TODO: fix this — fall back to non-gzipped response
    log.error('CLIENT DOES NOT ACCEPT GZIPPED REPSONSES');
    throw new Error();
  }
}

function createGzipFileHandler(gzippedFiles) {
  return {
    urlRegex: new RegExp(gzippedFiles.map(path.basename).join('|')),
    handler: responseHandler
  };
}

function Plugin(gzippedFiles, emitter, logger, customFileHandlers) {
  log = logger.create('gzip-plugin');

  emitter.on('file_list_modified', function(filesPromise) {
    filesPromise.then(function(files) {
      updateFiles(files, gzippedFiles);
      customFileHandlers.push(createGzipFileHandler(gzippedFiles));
    });
  });
}


// PUBLIC API
module.exports = Plugin;
