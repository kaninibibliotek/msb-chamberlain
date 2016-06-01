var express = require('express');
var morgan = require('morgan');
var path = require('path');

var config = require('./config.js');
var multer = require('multer');
var routes = require('./routes');

var upload = multer();
var app = express();

// Logging
app.use(morgan('dev'));

// Decoding
app.use(function(req, res, next) {
  req.url = decodeURIComponent(req.url);
  next();
});

// Miniscreen application and assets
app.use('/miniscreen/assets', express.static(path.resolve(config.MINISCREEN_APP_FOLDER, 'assets')));
app.use('/miniscreen/files', express.static(path.resolve(config.FS_ROOT, config.MINISCREEN_FOLDER_NAME))); 
app.use('/miniscreen/app', routes.miniscreen.app); // TODO: :id

// Krumelur application and assets
//app.use('/krumelur/assets', express.static(path.resolve(config.KRUMELUR_APP_FOLDER, 'assets')));
//app.use('/miniscreen/files', express.static(path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME))); 
//app.use('/miniscreen/app', routes.krumelur.app); // TODO: :id

// TODO: REMOVE THESE  ////////////////////
app.use('/msb-krumelur-player/' + config.KRUMELUR_FOLDER_NAME, express.static(path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME)));
app.use('/msb-krumelur-player', express.static(config.KRUMELUR_PLAYER_APP_FOLDER));

///////////////////////////////////////////

// REST API
app.get('/api/krumelur/latest/:amount', routes.krumelur.api.getLatestKrumelurs);
app.get('/api/krumelur/random/:amount', routes.krumelur.api.getRandomKrumelurs);
app.post('/api/krumelur', upload.any(), routes.krumelur.api.postKrumelur);
app.get('/api/miniscreen/:id', routes.miniscreen.api.getMiniscreen);

// Error handling
app.use(routes.errorHandler);

var port = process.env.PORT || 3000;
var mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

app.listen(port, function() {
  console.log(`🎩  Chamberlain at your service at port ${port} in ${mode} mode`);
});
