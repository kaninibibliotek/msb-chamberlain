var path = require('path');

module.exports = {
  KRUMELUR_PLAYER_APP_FOLDER: path.resolve(__dirname, '../msb-krumelur-player/'),
  MINISCREEN_APP_FOLDER: path.resolve(__dirname, '../msb-miniscreen/'),

  // TODO: What is the NAS path?
  FS_ROOT: process.env.NODE_ENV === 'development' ?
    path.resolve(__dirname, 'mock-fs') : __dirname,
};
