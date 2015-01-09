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
  this.bases[code] = this._Res(null, code, desc, uri, extras);
  return this.fn(code);
};

ResponseSet.prototype.fn = function(code) {
  return this.use.bind(this, code);
};

ResponseSet.prototype.use = function(code, desc, uri, extras) {
  var base = this.bases[code];
  if (!base) throw new Error('Response code "' + code + '" not registered');
  return ResponseSet._Res(base, code, desc, uri, extras);
};

/**
 *  Create a response given an optional base response.
 */

ResponseSet._Res = function(base, code, desc, uri, extras) {
  base = base || {};
  return merge(
    base,
    extras || {},
    {
      error: code,
      error_description: desc || base.error_description || '',
      error_uri: uri || base.error_uri || ''
    }
  );
};

ResponseSet.prototype.extend = function(responses) {
  extend(this.bases, responses.bases);
};

module.exports = ResponseSet;
