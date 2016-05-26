var express = require('express');

var config = require('./config.js');
var api    = require('./api.js');

var app = express();

app.use('/msb-krumelur-player', express.static(config.KRUMELUR_PLAYER));
app.use('/msb-miniscreen', express.static(config.MINISCREEN));


app.get('/krumelur/random/:amount', api.getKrumelur);
app.get('/miniscreen/:id', api.getMiniscreen);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Serving msb stuff at " + port);
});
