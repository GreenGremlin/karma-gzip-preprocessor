// Plugin.prototype.hander = function(request, response) {
//   var url = request.url.substr(1);
//   var urlBasename = path.basename(url).split('?')[0];
//   var file = compressedFiles[urlBasename];

//   setGzipresponseHeaders(response)

//   response.writeHead(200);
//   response.end(file.content);
//   log.debug('serving (gzip): ' + file.path)
// }

// var Plugin = function(emitter, logger, customFileHandlers) {
//   var log = logger.create('gzip-server');
//   var compressedFiles = Object.create(null);
//   var servedFiles = [];


//   emitter.on('file_list_modified', function(filesPromise) {
//     filesPromise.then(function(files) {
//       files.included.forEach(function(file) {
//         if (path.extname(file.path) === '.gz') {
//           compressedFiles[path.basename(file.path)] = file;
//         } else {
//           servedFiles.push(file);
//         }
//       });
//       files.served = servedFiles;
//     });
//   });
// };


var Plugin = require('./Plugin');
var Preprocessor = require('./Preprocessor');

Preprocessor.$inject = ['config.gzip', 'logger', 'helper'];

module.exports = {
  'framework:gzip': ['factory', Plugin],
  'preprocessor:gzip': ['factory', Preprocessor]
};
