var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var config = require('../../config');
var fileUtils = require('../../lib/fileUtils');

module.exports = function sendKrumelurApp(req, res, next) {
  var templatePath = path.resolve(config.KRUMELUR_APP_FOLDER, 'index.html');
  var template = _.template(fs.readFileSync(templatePath));

  // Get behaviors
  fileUtils.getBehaviors(function(err, behaviors) {
    if (err) {
      next(err);
    }

    // Get masks
    fileUtils.getMasks(function(err, masks) {
      if (err) {
        next(err);
      }

      // Get effects
      fileUtils.getEffects(function(err, effects) {
        if (err) {
          next(err);
        }

        // Get the 100 latest krumelurs for testing
        fileUtils.getLatestKrumelurs(100, function(err, krumelurs) {
          if (err) {
            next(err);
          } 

          var markup = template({
            env: process.env.NODE_ENV,
            behaviors: JSON.stringify(behaviors || [], null, '  '),
            masks:     JSON.stringify(masks || [], null, '  '),
            effects:   JSON.stringify(effects || [], null, '  '),
            krumelurs:   JSON.stringify(krumelurs || [], null, '  '),
          });

          res.send(markup);
        });
      });
    });
  });
};
