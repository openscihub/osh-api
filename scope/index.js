var ResponseSet = require('../lib/response-set');
var Scope = exports;


var responses = Scope.responses = new ResponseSet();
responses.add('insufficient_scope');
var InvalidScope = responses.add('invalid_scope');


/**
 *  All lifetimes are in seconds.
 */

var DEFAULT_LIFETIME = Scope.DEFAULT_LIFETIME = 3600; // one hour.
var DEFAULT_LIFETIME_FN = function() {return DEFAULT_LIFETIME;};

var SCOPES = {
  'account': {
    summary: 'Access account information: username, real name, etc.',
    details: (
      'Account information includes: name.'
    ),
    lifetime: DEFAULT_LIFETIME_FN
  }

};

Scope.get = function(name) {
  return SCOPES[name];
};

Scope.toArray = function(scope) {
  return 'string' === typeof scope ? scope.split(' ') : scope.concat();
};

Scope.minLifetime = function(scope, client) {
  return Math.min.apply(null,
    Scope.toArray(scope)
    .map(function(name) {
      return SCOPES[name].lifetime(client);
    })
    .concat(DEFAULT_LIFETIME)
  );
};

/**
 *  Find out if one scope is a subset of another.
 *
 *  Parameters:
 *
 *    - scope {required String}: The scope string to search for subset.
 *    - subset {required String}: A scope string.
 */

Scope.contains = function(scope, subset) {
  subset = Scope.toArray(subset);
  scope = Scope.toArray(scope);
  for (var i = 0, len = subset.length; i < len; i++) {
    if (scope.indexOf(subset[i]) < 0) return false;
  }
  return true;
};

Scope.validate = function(scope) {
  if (typeof scope !== 'string') {
    return InvalidScope('Scope must be a string.');
  }
  scope = Scope.toArray(scope);
  if (!scope.length) {
    return InvalidScope('Empty scope.');
  }
  for (var i = 0; i < scope.length; i++) {
    if (!(scope[i] in SCOPES)) {
      return InvalidScope('Scope contains invalid name.');
    }
  }
};
