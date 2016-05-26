var express = require('express');
var morgan = require('morgan');
var config = require('./config.js');
var api    = require('./api.js');

var app = express();

// Logging
app.use(morgan('dev'));

app.use('/msb-krumelur-player', express.static(config.KRUMELUR_PLAYER));
app.use('/msb-miniscreen', express.static(config.MINISCREEN));

app.get('/api/krumelur/random/:amount', api.getKrumelur);
app.get('/api/miniscreen/:id', api.getMiniscreen);

var port = process.env.PORT || 3000;
var mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

app.listen(port, function() {
  console.log(`🎩  Chamberlain at your service at port ${port} in ${mode} mode`);
});
