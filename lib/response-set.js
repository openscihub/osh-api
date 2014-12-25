var merge = require('xtend/immutable');
var extend = require('xtend/mutable');
var CODE = /^[a-z_]+$/;

function ResponseSet() {
  this.bases = {};
  this.add('connection_error', 'Connection error.');
  this.add('not_found', 'Not found.');
  this.add('server_error', 'Server error.');
}

ResponseSet.prototype.add = function(code, desc, uri, extras) {
  if ('string' != typeof code || !CODE.test(code)) {
    throw new Error('Response needs a valid code.');
  }
  this.bases[code] = merge(extras || {}, {
    error_description: desc || '',
    error_uri: uri || ''
  });
};

ResponseSet.prototype.use = function(code, extras) {
  var base = this.bases[code];
  if (!base) throw new Error('Response code "' + code + '" not registered');
  return merge(base, extras, {error: code});
};

ResponseSet.prototype.extend = function(responses) {
  extend(this.bases, responses.bases);
};

module.exports = ResponseSet;
