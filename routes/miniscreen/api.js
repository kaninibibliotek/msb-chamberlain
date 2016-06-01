var fs = require('fs');
var path = require('path');
var config = require('../../config');
var fileUtils = require('../../lib/fileUtils');

// Sends JSON representation of all files in a miniscreen folder
function getMiniscreen(req, res, next) {
  var screenId = req.params.id;

  fileUtils.getMiniscreenFiles(screenId, function(err, files) {
    if (err) {
      next(err);
    } else {
      res.json({results: files});
    }
  });
}


// This middleware is invoked if next(err) is called
function errorHandler(err, req, res, next) {
  console.error('Error', err.stack);

  // TODO: Not tested!
  if (req.xhr) {
    res.status(500);
    res.render('error', { error: err });
  }
}

module.exports = {
  errorHandler: errorHandler,
};
