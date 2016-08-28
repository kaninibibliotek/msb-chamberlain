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

  fileUtils.getLatestKrumelurs(amount, function(err, krumelurs) {
    if (err) {
      next(err);
    } else {
      res.json({results: krumelurs});
    }
  });
}

function postKrumelur(req, res, next) {
  // test: curl -X POST --data-binary @filnamn.png http://localhost:3000/api/krumelur
  var buffers = [];
  var totalLength = 0;

  req.on('data', function(data) {
    buffers.push(data);
    totalLength += data.length;
  });

  req.on('end', function() {
    var krumelurJson =  fileUtils.writeKrumelur(Buffer.concat(buffers, totalLength));
    req.krumelur = krumelurJson;
    next();
  });

  res.sendStatus(200);
}

module.exports = {
  getRandomKrumelurs: getRandomKrumelurs,
  getLatestKrumelurs: getLatestKrumelurs,
  postKrumelur: postKrumelur
};
