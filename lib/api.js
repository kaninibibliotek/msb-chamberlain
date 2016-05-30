// TODO move file reading stuff
var fs = require('fs');
var path = require('path');
var config = require('../config');
var fileUtils = require('./fileUtils');

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomKrumelurs(req, res, next) {
  var amount = parseInt(req.params.amount) || 1;

  fileUtils.getAllKrumelurs(function(err, krumelurs) {
    if (err) {
      next(err);
    } else {
      var randomKrumelurs = [];
      var numKrumelurs = Math.min(krumelurs.length, amount);

      for (var i = 0; i < numKrumelurs; i++) {
        var index = getRandomInt(0, krumelurs.length);

        // Remove each selected element so we won't get more of the same
        randomKrumelurs = randomKrumelurs.concat(krumelurs.splice(index, 1));
      }

      res.json({results: randomKrumelurs});
    }
  });
}

function getLatestKrumelurs(req, res) {
  var amount = parseInt(req.params.amount) || 1;

  fileUtils.getAllKrumelurs(function(err, krumelurs) {
    if (err) {
      next(err);
    } else {
      var latestKrumelurs = [];
      var numKrumelurs = Math.min(krumelurs.length, amount);

      krumelurs.sort(function (k1, k2) {
        return k1.created < k2.created; 
      });

      var latestKrumelurs =  krumelurs.slice(0, numKrumelurs);
      
      res.json({results: latestKrumelurs});
    }
  });
}

// TODO!
// Krumelurmaskin will post a new Krumelur here
// Assign the Krumelur a behavior and save it with the correct filename
function postKrumelur(req, res) {
   
  //var behavior = config.behaviors[random];
  //
}

// Sends JSON representation of all files in a miniscreen folder
function getMiniscreen(req, res, next) {
  var screenId = req.params.id;
  var screenDir = path.resolve(config.FS_ROOT, 'miniskärmar', screenId);

  fs.readdir(screenDir, function(err, files) {
    if (err) {
      next(err);
    } else {
      var mediaArr = files.map(function(file) {
        return fileUtils.parseFile(file);
      });

      res.json({results: mediaArr});
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
  getRandomKrumelurs: getRandomKrumelurs,
  getLatestKrumelurs: getLatestKrumelurs,
  postKrumelur: postKrumelur,
  getMiniscreen: getMiniscreen,
  errorHandler: errorHandler,
};
