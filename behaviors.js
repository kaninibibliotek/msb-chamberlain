const MAX_BEHAVIOR = 100;

module.exports = {
  // Return a random string '000', to '100'
  getRandom: function() {
    const num = Math.floor(Math.random() * MAX_BEHAVIOR);
    const paddedStr = (num < 10 ? '00' : num < 100 ? '0' : '') + num;  
    return paddedStr;
  }
};

