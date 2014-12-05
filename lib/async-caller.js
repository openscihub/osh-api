module.exports = function(callback) {
  return function() {
    var args = arguments;
    process.nextTick(function() {
      callback.apply(null, args);
    });
  };
};
