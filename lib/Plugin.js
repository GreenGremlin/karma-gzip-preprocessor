var path = require('path');

var log = null;
var compressedFiles = Object.create(null);
var basePath = null;

function relativePath(basePath, filePath) {
  return filePath.replace(basePath, '');
}

function filterOutGzippedFiles(files, gzippedFilePaths) {
  var webserverFiles = [];

  // filter out gzipped files from .served
  files.served.forEach(function(file) {
    if (gzippedFilePaths.indexOf(file.path) !== -1) {
      compressedFiles[relativePath(basePath, file.path)] = file;
    } else {
      webserverFiles.push(file);
    }
  });

  files.served = webserverFiles;
}

// Set gzip headers on the response
function setGzipHeaders(response) {
  response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  response.setHeader('Content-Encoding', 'gzip');
  response.setHeader('Vary', 'Accept-Encoding');
}

// check if the client accepts gzipped responses
function acceptsGzip(request) {
  // TODO: request.getHeader ???
  return request.headers['accept-encoding'].indexOf('gzip') !== -1;
}

// Response handler for gzip encoded files
function gzipResponseHandler(request, response) {
  var urlPath = request.url.split('?')[0];
  var file = compressedFiles[ urlPath.replace('/base', '') ];

  if (!file) {
    log.error('Gzipped file not found: ' + request.url);
    throw new Error('Gzipped file not found: ' + request.url);
  }

  if (acceptsGzip(request)) {
    log.debug('found file, serving (gzip): ' + file.path);
    setGzipHeaders(response);
    response.writeHead(200);
    response.end(file.content);
  } else {
    // TODO: fix this — fall back to non-gzipped response
    log.error('Client does not accept gzipped responses');
    throw new Error();
  }
}

function createGzipHandler(gzippedFilePaths) {
  return {
    urlRegex: new RegExp(gzippedFilePaths.map(relativePath.bind(null, basePath)).join('|')),
    handler: gzipResponseHandler
  };
}

function Plugin(gzippedFilePaths, emitter, logger, customFileHandlers, configBasePath) {
  log = logger.create('gzip-plugin');
  basePath = configBasePath;

  emitter.on('file_list_modified', function(files) {
    // create handlers only once, this makes sense only for `watch mode`
    // assume that file list doesn't change in between watched runs
    if (Object.keys(compressedFiles).length === 0) {
      customFileHandlers.push(createGzipHandler(gzippedFilePaths));
    }
    filterOutGzippedFiles(files, gzippedFilePaths);
  });
}

// PUBLIC API
module.exports = Plugin;
