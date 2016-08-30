var fileUtils = require('../../lib/fileUtils');

function getRandomKrumelurs(req, res, next) {
  var amount = parseInt(req.params.amount) || 1;

  fileUtils.getRandomKrumelurs(amount, (err, krumelurs) => {
    if (err) {
      next(err);
    } else {
      res.json({results: krumelurs});
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
