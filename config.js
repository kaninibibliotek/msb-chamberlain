var path = require('path');

module.exports = {
  KRUMELUR_PLAYER: path.resolve(__dirname, '../msb-krumelur-player/'),
  MINISCREEN: path.resolve(__dirname, 'mock-fs/static/'),
  FS_ROOT: process.env.NODE_ENV === 'development' ?
    path.resolve(__dirname, 'mock-fs') : __dirname,
};
