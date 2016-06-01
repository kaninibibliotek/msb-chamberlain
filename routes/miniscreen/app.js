var _ = require('lodash');
var config = require('../../config');
var path = require('path');

module.exports = function sendMiniscreenApp(req, res) {
  res.sendfile(path.resolve(config.MINISCREEN_APP_FOLDER, 'index.html'));
};
