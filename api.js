// TODO move file reading stuff
var fs = require('fs');
var path = require('path');
var config = require('./config');

var krumelurer = [];
var media      = [];

fs.readdir(__dirname + '/behaviors', function(err, files) {
  if (err) {
    console.log(err);
  } else {
    files.forEach(function(file) {
      fs.readFile(__dirname + '/behaviors/' + file, 'utf8', function(err, data) {
        if (err) {
          console.log(err);
        } else {
          krumelurer.push(JSON.parse(data));
        }
      });
    });
  }
});

fs.readdir(__dirname + '/mediajson', function(err, files) {
  if (err) {
    console.log(err);
  } else {
    files.forEach(function(file) {
      fs.readFile(__dirname + '/mediajson/' + file, 'utf8', function(err, data) {
        if (err) {
          console.log(err);
        } else {
          media.push(JSON.parse(data));
        }
      });
    });
  }
});

function getRandomKrumelurer(amount) {
  var rk = [];

  for (var i = 0; i < amount && krumelurer.length > 0; i++) {
    rk.push(krumelurer[Math.floor(Math.random() * krumelurer.length)]);
  }

  return rk;
}


const getKrumelur = function(req, res) {
  var amount = parseInt(req.params.amount);

  console.log("GET krumelurer", amount);

  res.send(getRandomKrumelurer(amount));
}

// TODO
function getMediaType(file) {
  return 'image';
}

// Sends JSON representation of all files in a miniscreen folder
const getMiniscreen = function(req, res) {
  const screenId = req.params.id;
  const screenDir = path.resolve(config.FS_ROOT, 'miniskärmar', screenId); 

  fs.readdir(screenDir, function(err, files) {
    if (err) {
      console.log(err);
    } else {
      const mediaArr = files.map(file => ({
        type: getMediaType(file),
        url: file,
        duration: 666,
        behavior: 'crazy',
      }));
      
      res.json(mediaArr);
    }
  });
}


module.exports = {
  getKrumelur,
  getMiniscreen,
};
