var behaviors = [
  'crazy',
  'tired',
  'calm'
];

module.exports = {
  getRandom: function() {
    return behaviors[Math.floor(Math.random() * behaviors.length)];
  }
};
