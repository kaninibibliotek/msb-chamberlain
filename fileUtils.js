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

/*
function getDuration(file) {
  return 2000;
}
*/

function parseFile(file) {
  return {
    behavior: getKrumelurBehavior(file)
    // duration: getDuration(file),
    type:     getMediaType(file),
    url:      file,
  };
}

module.exports = {
  parseFile: parseFile
};
