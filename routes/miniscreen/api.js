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

module.exports = {
  getMiniscreen: getMiniscreen,
};
