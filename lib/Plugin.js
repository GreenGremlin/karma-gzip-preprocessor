const _compressedFiles = Object.create(null);
let _log = null;

function relativePath(basePath, filePath) {
  return filePath.replace(basePath, '');
}

function filterOutGzippedFiles(files, gzippedFilePaths, basePath) {
  const webserverFiles = [];

  // filter out gzipped files from .served
  files.served.forEach(file => {
    if (gzippedFilePaths.includes(file.path)) {
      _compressedFiles[relativePath(basePath, file.path)] = file;
    } else {
      webserverFiles.push(file);
    }
  });

  // eslint-disable-next-line no-param-reassign
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
  const urlPath = request.url.split('?')[0];
  const file = _compressedFiles[urlPath.replace('/base', '')];

  if (!file) {
    _log.error(`Gzipped file not found: ${request.url}`);
    throw new Error(`Gzipped file not found: ${request.url}`);
  }

  if (acceptsGzip(request)) {
    _log.debug(`found file, serving (gzip): ${file.path}`);
    setGzipHeaders(response);
    response.writeHead(200);
    response.end(file.content);
  } else {
    // TODO: fix this — fall back to non-gzipped response
    _log.error('Client does not accept gzipped responses');
    throw new Error();
  }
}

function createGzipHandler(gzippedFilePaths, basePath) {
  const relativePaths = gzippedFilePaths.map(filePath => filePath.replace(basePath, ''));
  return {
    urlRegex: new RegExp(gzippedFilePaths.map(relativePaths).join('|')),
    handler: gzipResponseHandler,
  };
}

function Plugin(gzippedFilePaths, emitter, logger, customFileHandlers, configBasePath) {
  _log = logger.create('gzip-plugin');

  emitter.on('file_list_modified', files => {
    // create handlers only once, this makes sense only for `watch mode`
    // assume that file list doesn't change in between watched runs
    if (Object.keys(_compressedFiles).length === 0) {
      customFileHandlers.push(createGzipHandler(gzippedFilePaths, configBasePath));
    }
    filterOutGzippedFiles(files, gzippedFilePaths, configBasePath);
  });
}

// PUBLIC API
module.exports = Plugin;
