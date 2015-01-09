var ResponseSet = require('../lib/response-set');
var Action = require('../lib/simple-action');
var Route = require('osh-route');
var merge = require('xtend/immutable');
var OAuth2 = require('../oauth2');
var Scope = require('../scope');


var responses = getAccessToken.responses = OAuth2.responses;

var InvalidRequest = responses.fn('invalid_request');
var UnauthorizedClient = responses.fn('unauthorized_client');

getAccessToken.method = 'POST';
getAccessToken.route = new Route({path: '/oauth2/token'});


function getAccessToken(opts, callback) {
  Action(
    merge(getAccessToken, {
      payload: getAccessToken.Payload(opts)
    }),
    callback
  );
}

getAccessToken.Payload = function(opts) {
  var payload = {
    grant_type: (
      (opts.code && 'authorization_code') ||
      (opts.secret && (opts.password ? 'password' : 'client_credentials')) ||
      'refresh_token'
    ),
    client_id: (
      opts.client ||
      (OAuth2.USER_CLIENT_PREFIX + opts.username) ||
      (OAuth2.APP_CLIENT_PREFIX + opts.app)
    ),
    client_secret: opts.secret || opts.password,
    scope: opts.scope
  };

  if (opts.secret && opts.password) {
    payload.username = opts.username;
    payload.password = opts.password;
  }

  if (opts.code) {
    payload.code = opts.code;
    payload.redirect_uri = opts.redirectUri;
  }

  return payload;
};


var GRANTS = {
  client_credentials: {
    validate: function(body) {
      return (
        (
          (!OAuth2.USER_CLIENT_PREFIX_RE.test(body.client_id)) &&
          UnauthorizedClient('Client is not a user.')
        ) ||
        Scope.validate(body.scope)
      );
    }
  },

  password: {
    validate: function(body) {
      return (
        (
          (OAuth2.TRUSTED_CLIENTS.indexOf(body.client_id) < 0) &&
          UnauthorizedClient('Client is not trusted.')
        ) ||
        Scope.validate(body.scope)
      );
    }
  },

  refresh_token: {
    validate: function(body) {
      return (
        (
          ('string' !== typeof body.refresh_token) &&
          InvalidRequest('Missing refresh token.')
        ) ||
        (body.scope !== undefined && Scope.validate(body.scope))
      );
    }
  }
};


getAccessToken.validate = function(payload) {
  var grantType = payload.grant_type;
  if (!grantType) {
    return InvalidRequest('Missing grant_type.');
  }
  var grant = GRANTS[grantType];
  if (!grant) {
    return responses.use('unsupported_grant_type');
  }
  return (
    (!payload.client_id && InvalidRequest('Missing client id.')) ||
    (!payload.client_secret && InvalidRequest('Missing client secret.')) ||
    grant.validate(payload)
  );
};


module.exports = getAccessToken;
