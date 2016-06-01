var express = require('express');
var morgan = require('morgan');
var path = require('path');

var config = require('./config.js');
var multer = require('multer');
var api    = require('./lib/api.js');
var routes = require('./routes');

var upload = multer();
var app = express();

// Logging
app.use(morgan('dev'));

app.get('/miniscreentest', routes.miniscreen.app);
app.get('/krumelurtest', routes.krumelur.app);

// Static miniscreen media and Krumelur files in the NAS public folder
app.use('/msb-miniscreen/' + config.MINISCREEN_FOLDER_NAME, express.static(path.resolve(config.FS_ROOT, config.MINISCREEN_FOLDER_NAME)));
app.use('/msb-krumelur-player/' + config.KRUMELUR_FOLDER_NAME, express.static(path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME)));

// Application JS and CSS resources
app.use('/msb-krumelur-player', express.static(config.KRUMELUR_PLAYER_APP_FOLDER));
app.use('/msb-miniscreen', express.static(config.MINISCREEN_APP_FOLDER));

// REST API
app.get('/api/krumelur/latest/:amount', api.getLatestKrumelurs);
app.get('/api/krumelur/random/:amount', api.getRandomKrumelurs);
app.post('/api/krumelur', upload.any(), api.postKrumelur);
app.get('/api/miniscreen/:id', api.getMiniscreen);




// Error handling
app.use(api.errorHandler);

var port = process.env.PORT || 3000;
var mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

app.listen(port, function() {
  console.log(`🎩  Chamberlain at your service at port ${port} in ${mode} mode`);
});
