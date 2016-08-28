var express = require('express');
var morgan = require('morgan');
var path = require('path');

var config = require('./config.js');
var routes = require('./routes');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Websocket API
io.on('connection', function(socket){
  console.log('A user connected');
});

function emitNewKrumelur(req, res, next) {
  io.emit('newKrumelur', req.krumelur);
  next();
}

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
app.use('/miniscreen/app/:id', routes.miniscreen.app);

// Krumelur application and assets
app.use('/krumelur/assets', express.static(path.resolve(config.KRUMELUR_APP_FOLDER, 'assets')));
app.use('/krumelur/files', express.static(path.resolve(config.FS_ROOT, config.KRUMELUR_FOLDER_NAME)));
app.use('/krumelur/effects', express.static(path.resolve(config.KRUMELUR_APP_FOLDER, 'effects')));
app.use('/krumelur/app', routes.krumelur.app);

// REST API
app.get('/api', (req, res, next) => res.send('Chamberlain is up and running.'));
app.get('/api/krumelur/latest/:amount', routes.krumelur.api.getLatestKrumelurs);
app.get('/api/krumelur/random/:amount', routes.krumelur.api.getRandomKrumelurs);
app.post('/api/krumelur', routes.krumelur.api.postKrumelur, emitNewKrumelur);
app.get('/api/miniscreen/:id', routes.miniscreen.api.getMiniscreen);

// Error handling
app.use(routes.errorHandler);

var port = process.env.PORT || 3000;
var mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

http.listen(port, function() {
  console.log(`🎩  Chamberlain at your service at port ${port} in ${mode} mode`);
});
