function ResponseSet() {
  this.length = 0;
  this.Success = this.add({message: 'Success.'});
}

ResponseSet.prototype.add = function(defaults) {
  defaults = defaults || {};
  var code = this.length++;
  this[code] = defaults;

  return function(opts) {
    opts = opts || {};
    return {
      code: code,
      message: opts.message || defaults.message || '',
      result: opts.result || defaults.result || {}
    };
  };
};

ResponseSet.prototype.extend = function(responses) {
  for (var i = 1, len = responses.length; i < len; i++) {
    this.add(responses[i]);
  }
};

module.exports = ResponseSet;
