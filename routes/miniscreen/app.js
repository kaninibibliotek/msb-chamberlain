var _ = require('lodash');
var config = require('../../config');
var path = require('path');
var fs = require('fs');

module.exports = function sendMiniscreenApp(req, res) {
  var templatePath = path.resolve(config.MINISCREEN_APP_FOLDER, 'index.html');
  var template = _.template(fs.readFileSync(templatePath));

  res.send(
    template({
      screenId: req.params.id
    })
  );
};
