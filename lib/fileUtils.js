var path = require('path');
var fs = require('fs');

var config = require('../config');
var behaviors = require('../behaviors');

function writeKrumelur(buffer) {
  var krumelurName = generateKrumelurFileName();
  var krumelurPath = path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME, krumelurName);

  fs.writeFile(krumelurPath, buffer, 'utf8');
}

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

// file.json => file
function getFileNameWithoutExtension(file) {
  return file.substr(0, file.lastIndexOf('.'));
}

function isDotFile(file) {
  return file.startsWith('.');
}

function isJson(file) {
  return getFileExtension(file) === 'json';
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
  var media = [];

  // TODO: Try / catch around file system access?
  fs.readdir(miniscreenFolder, function(err, files) {
    if (files) {
      var wantsLatest = false;

      media = files.filter(function(file) {
        if (file.toLowerCase().startsWith('senaste krumelur')) {
          wantsLatest = true;
        }

        return !isDotFile(file) &&
               !isDirectory(path.resolve(miniscreenFolder, file)) &&
               hasSupportedFileFormat(file);
      })
      .map(function(file) {
        return buildMiniscreenContentFromFile(screenId, file);
      });

      if (wantsLatest) {
        getAllKrumelurs(function(e, krumelurs) {
          if (krumelurs) {
            var sorted = krumelurs.sort(function(a, b) {
              return b.created - a.created;
            });

            var latest = sorted[0];
            latest.url = '/krumelur/' + latest.url;

            media.push(sorted[0]);
          }

          cb(err, media);
        });
      } else {
        cb(err, media);
      }
    }
  });
}

function getAllKrumelurs(cb) {
  var krumelurFolder = path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME);
  var krumelurs = [];

  // TODO: Try / catch around file system access?
  fs.readdir(krumelurFolder, function(err, files) {
    if (files) {
      krumelurs = files.filter(function(file) {
        return isKrumelur(file);
      })
      .map(function(file) {
        return buildKrumelurFromFile(file);
      });
    }

    cb(err, krumelurs);
  });
}

// returns [
//   {
//     behaviorName1: {...}
//   }, {
//     behaviorName2: {...}
//   }, ...
// ];
function getBehaviors(cb) {
  var folder = path.resolve(config.KRUMELUR_APP_FOLDER, 'behaviors');

  // TODO: Try / catch around file system access?
  fs.readdir(folder, function(err, files) {
    if (files) {
      var behaviorNames = files.filter(function(file) {
        // TODO: Sanity check
        // if (isJson(file))
        return file;
      });

      var behaviors = behaviorNames.reduce((acc, file) => {
        var behaviorName = getFileNameWithoutExtension(file);
        var behaviorPath = path.resolve(folder, file);
        acc[behaviorName] = require(behaviorPath);

        return acc;
      }, {})
    }

    cb(err, behaviors);
  });
}

// Returns an array of all masks in ../msb-krumelur-player/masks
function getMasks(cb) {
  var folder = path.resolve(config.KRUMELUR_APP_FOLDER, 'masks');
  var masks = [];

  // TODO: Try / catch around file system access?
  fs.readdir(folder, function(err, files) {
    if (files) {
      masks = files.filter(function(file) {
        // TODO: Sanity check
        // if (isJson(file))
        return file;
      })
      .map(function(file) {
        var maskPath = path.resolve(folder, file);
        return require(maskPath);
      });
    }

    cb(err, masks);
  });
}

function getEffects(cb) {
  var folder = path.resolve(config.KRUMELUR_APP_FOLDER, 'effects');
  var effects = [];

  fs.readdir(folder, function(err, files) {
    if (files) {
      effects = files.filter(function(file) {
        return isJson(file);
      })
      .map(function(file) {
        var effectPath = path.resolve(folder, file);
        return require(effectPath);
      });
    }

    cb(err, effects);
  });
}

function buildKrumelurFromFile(file) {
  var json = buildJsonFromFile(file);

  json.url = path.join('files', json.url);

  return json;
}

function buildMiniscreenContentFromFile(screenId, file) {
  var json = buildJsonFromFile(file);

  //json.url = path.join(config.MINISCREEN_FOLDER_NAME, screenId, json.url);
  json.url = path.join('files', screenId, json.url);

  return json;
}

function buildJsonFromFile(file) {
  return {
    behavior: getKrumelurBehavior(file),
    created:  getKrumelurCreatedDate(file),
    type:     getMediaType(file),
    url:      file,
  };
}

module.exports = {
  getAllKrumelurs: getAllKrumelurs,
  getMiniscreenFiles: getMiniscreenFiles,
  getBehaviors: getBehaviors,
  getMasks: getMasks,
  getEffects: getEffects,
  writeKrumelur: writeKrumelur,
};
