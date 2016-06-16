var fileUtils = require('../../lib/fileUtils');

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

      var latestKrumelurs = krumelurs.slice(0, numKrumelurs);

      res.json({results: latestKrumelurs});
    }
  });
}

function postKrumelur(req, res) {
  // test: curl -X POST --data-binary @filnamn.png http://localhost:3000/api/krumelur
  var buffers = [];
  var totalLength = 0;

  req.on('data', function(data) {
    buffers.push(data);
    totalLength += data.length;
  });

  req.on('end', function() {
    fileUtils.writeKrumelur(Buffer.concat(buffers, totalLength));
  });

  res.sendStatus(200);
}

module.exports = {
  getRandomKrumelurs: getRandomKrumelurs,
  getLatestKrumelurs: getLatestKrumelurs,
  postKrumelur: postKrumelur
};
