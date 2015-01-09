var ResponseSet = require('../lib/response-set');
var Scope = require('../scope');

var OAuth2 = {

  USER_CLIENT_PREFIX: 'user:',
  USER_CLIENT_PREFIX_RE: /^user:/,

  APP_CLIENT_PREFIX: 'app:',
  APP_CLIENT_PREFIX_RE: /^app:/,

  extendUriQuery: function(uri, query) {
    uri = url.parse(uri, true);
    extend(uri.query, query);
    return url.format(uri);
  },

  scopeArray: function(scope) {
    return 'string' == typeof scope ? scope.split(' ') : scope.concat();
  },

  scopeString: function(scope) {
    return 'string' == typeof scope ? scope : scope.join(' ');
  },

  removeScope: function(remove, scope) {
    var newScope = OAuth2.scopeArray(scope);
    OAuth2.scopeArray(remove).forEach(function(string) {
      var index = newScope.indexOf(string);
      if (index >= 0) newScope.splice(index, 1);
    });
    return OAuth2.scopeString(newScope);
  },

  expirationFromLifetime: function(now, lifetime) {
    var expires = new Date(now);
    expires.setSeconds(expires.getSeconds() + lifetime);
    return expires;
  }
};

/**
 *  These responses come from
 *  http://tools.ietf.org/html/rfc6749#section-5.2
 */

var responses = OAuth2.responses = new ResponseSet();

responses.extend(Scope.responses);
responses.add('invalid_request');
responses.add('unauthorized_client');
responses.add('invalid_client');
responses.add('invalid_grant');
responses.add('invalid_token');
responses.add(
  'unsupported_grant_type',
  'Supported grant types are "client_credentials", "password", "refresh_token", and "authorization_code"'
);

module.exports = OAuth2;
