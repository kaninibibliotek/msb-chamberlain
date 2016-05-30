var path = require('path');
var fs = require('fs');
var config = require('../config');

function getMediaType(file) {
  if (isKrumelur(file)) {
    return 'krumelur';
  }

  var fileExt = file.substring(file.lastIndexOf('.'));
  var type;

  switch (fileExt) {
    case '.png':
    case '.jpg':
    case '.jpeg':
      type = 'image';
      break;
    case '.mp4':
    case '.mov':
      type = 'video';
      break;
  }

  return type;
}

function isKrumelur(file) {
  return /\d{8}_\d{6}_krumelur_\w+\.png$/.test(file);
}

function getKrumelurBehavior(file) {
  if (!isKrumelur(file)) {
    return null;
  }

  return /_([^_]+)\.png$/.exec(file)[1];
}

function getAllKrumelurs(cb) {
  var krumelurFolder = path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME);
  var krumelurs = [];

  // TODO: Try / catch around file system access?
  fs.readdir(krumelurFolder, function(err, files) {
    krumelurs = files.map(function(file) {
      if (isKrumelur(file)) {
        return parseFile(file);
      }
    });

    return cb(err, krumelurs)
  });
}

function parseFile(file) {
  return {
    behavior: getKrumelurBehavior(file),
    // duration: getDuration(file),
    type:     getMediaType(file),
    url:      file,
  };
}

module.exports = {
  parseFile: parseFile,
  getAllKrumelurs: getAllKrumelurs,
};
