var path = require('path');
var fs = require('fs');

var config = require('../config');
var behaviors = require('../behaviors');

function generateKrumelurFileName() {
  var date = new Date();

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var YYYYMMDD = timeUnitToString(year) + timeUnitToString(month) + timeUnitToString(day);
  var HHMMSS = timeUnitToString(hours) + timeUnitToString(minutes) + timeUnitToString(seconds);

  var behavior = behaviors.getRandom();

  return YYYYMMDD + '_' + HHMMSS + '_krumelur_' + behavior + '.png';
}

function timeUnitToString(unit) {
  return unit < 10 ? '0' + unit : unit.toString();
}

function getMediaType(file) {
  if (isKrumelur(file)) {
    return 'krumelur';
  }

  var fileExt = getFileExtension(file);
  var type;

  switch (fileExt.toLowerCase()) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      type = 'image';
      break;
    case 'mp4':
    case 'mov':
      type = 'video';
      break;
  }

  return type;
}

function hasSupportedFileFormat(file) {
  var fileExt = getFileExtension(file);

  return config.SUPPORTED_FORMATS.indexOf(fileExt.toLowerCase()) !== -1;
}

function getFileExtension(file) {
  return file.substring(file.lastIndexOf('.') + 1);
}

function isDotFile(file) {
  return file.startsWith('.');
}

function isDirectory(path) {
  return fs.statSync(path).isDirectory();
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

function getKrumelurCreatedDate(file) {
  if (!isKrumelur(file)) {
    return null;
  }

  // TODO: Timezones? 24h clock?

  // YYYYMMDD_HHMMSS_krumelur_BEHAVIOR.png
  var year = file.substring(0, 4);
  var month = file.substring(4, 6);
  var day = file.substring(6, 8);
  var hour = file.substring(9, 11);
  var minute = file.substring(11, 13);
  var second = file.substring(13, 15);

  return new Date(year, month, day, hour, minute, second);
}

function getMiniscreenFiles(screenId, cb) {
  var miniscreenFolder = path.resolve(config.FS_ROOT, config.MINISCREEN_FOLDER_NAME, screenId);
  var files = [];

  // TODO: Try / catch around file system access?
  fs.readdir(miniscreenFolder, function(err, files) {
    files = files.filter(function(file) {
      return !isDotFile(file) &&
             !isDirectory(path.resolve(miniscreenFolder, file)) &&
             hasSupportedFileFormat(file);
    })
    .map(function(file) {
      return parseFile(file);
    });

    return cb(err, files)
  });
}

function getAllKrumelurs(cb) {
  var krumelurFolder = path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME);
  var krumelurs = [];

  // TODO: Try / catch around file system access?
  fs.readdir(krumelurFolder, function(err, files) {
    krumelurs = files.filter(function(file) {
      return isKrumelur(file);
    })
    .map(function(file) {
      return parseFile(file);
    });

    return cb(err, krumelurs)
  });
}

function parseFile(file) {
  return {
    behavior: getKrumelurBehavior(file),
    created: getKrumelurCreatedDate(file),
    // duration: getDuration(file),
    type:     getMediaType(file),
    url:      file,
  };
}

module.exports = {
  parseFile: parseFile,
  getAllKrumelurs: getAllKrumelurs,
  getMiniscreenFiles: getMiniscreenFiles,
  generateKrumelurFileName: generateKrumelurFileName
};
