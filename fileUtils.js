var behaviors = require('./behaviors');

function getKrumelurFileName() {
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

function getDuration(file) {
  return 2000;
}

function parseFile(file) {
  return {
    type:     getMediaType(file),
    url:      file,
    duration: getDuration(file),
    behavior: getKrumelurBehavior(file)
  };
}

module.exports = {
  parseFile: parseFile,
  getKrumelurFileName: getKrumelurFileName
};
