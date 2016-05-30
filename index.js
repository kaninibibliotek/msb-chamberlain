var express = require('express');
var morgan = require('morgan');
var path = require('path');
var config = require('./config.js');
var api    = require('./lib/api.js');

var app = express();

// Logging
app.use(morgan('dev'));

// Static miniscreen media and Krumelur files in the NAS public folder 
app.use('/miniscreens', express.static(path.resolve(config.FS_ROOT, 'miniskärmar')));
app.use('/krumelurs', express.static(path.resolve(config.FS_ROOT, 'krumelurer')));

// Application JS and CSS resources
app.use('/msb-krumelur-player', express.static(config.KRUMELUR_PLAYER_APP_FOLDER));
app.use('/msb-miniscreen', express.static(config.MINISCREEN_APP_FOLDER));

// REST API
app.get('/api/krumelur/latest/:amount', api.getLatestKrumelurs);
app.get('/api/krumelur/random/:amount', api.getRandomKrumelurs);
app.post('/api/krumelur', api.postKrumelur);
app.get('/api/miniscreen/:id', api.getMiniscreen);

var port = process.env.PORT || 3000;
var mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

app.listen(port, function() {
  console.log(`🎩  Chamberlain at your service at port ${port} in ${mode} mode`);
});
