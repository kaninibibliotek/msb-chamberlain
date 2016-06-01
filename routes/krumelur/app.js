var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var config = require('../../config');

var templatePath = path.resolve(config.KRUMELUR_PLAYER_APP_FOLDER, 'index.html');
var template = _.template(fs.readFileSync(templatePath));

var templateData = {
  kiss: 'bajs',
  bruno: [1,2,3,4]
};

module.exports = function sendKrumelurApp(req, res) {

  var markup = template({serverData: JSON.stringify(templateData)});
  res.send(markup);

  //res.send(template);
};
