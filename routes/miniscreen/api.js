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

/*
function substituteSpecialFiles(files, done) {
  // Replace latest krumelur
  //console.log('files', files);
  async.map(files, function(file, cb) {
    if (isLatestKrumelurFile(file.url)) {
      fileUtils.getLatestKrumelurs(1, function(err, krumelurs) {
        filej
        file.url = krumelurs[1]
              
      });
      console.log('file', file);
      file.url = 'kaka'; 
    } 
    cb(null, file);
  }, function(err, result) {
    done(err, result);
  })

}
*/

module.exports = {
  getMiniscreen: getMiniscreen,
};
