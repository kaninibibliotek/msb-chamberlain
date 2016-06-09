var path = require('path');

module.exports = {
  KRUMELUR_APP_FOLDER: path.resolve(__dirname, '../msb-krumelur-player/'),
  MINISCREEN_APP_FOLDER: path.resolve(__dirname, '../msb-miniscreen/'),

  KRUMELUR_FOLDER_NAME: 'krumelurer',
  EFFECT_FOLDER_NAME: 'effekter',
  MINISCREEN_FOLDER_NAME: 'miniskärmar',

  // TODO: What is the NAS path?
  FS_ROOT: process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, 'mock-fs')
    : path.resolve(__dirname, '..', '..', 'shared'),   

  SUPPORTED_FORMATS: [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'mp4',
    'mov'
  ],
};
