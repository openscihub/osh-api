var ResponseSet = require('../lib/response-set');
var Action = require('../lib/simple-action');
var Route = require('osh-route');
var merge = require('xtend/immutable');
var OAuth2 = require('../oauth2');
var Scope = require('../scope');
var Client = require('../client');


var responses = getAccessToken.responses = OAuth2.responses;

var InvalidRequest = responses.fn('invalid_request');
var UnauthorizedClient = responses.fn('unauthorized_client');

getAccessToken.method = 'POST';
getAccessToken.route = new Route({path: '/oauth2/token'});


function getAccessToken(opts, callback) {
  Action(
    merge(getAccessToken, {
      //payload: getAccessToken.Payload(opts)
      payload: opts
    }),
    callback
  );
}

// Silly idea? Stick to OAuth2 standard; everybody knows it.

//getAccessToken.Payload = function(opts) {
//  var payload = {
//    grant_type: (
//      opts.grant_type ||
//      (opts.code && 'authorization_code') ||
//      (opts.password && (opts.secret ? 'password' : 'client_credentials')) ||
//      'refresh_token'
//    ),
//    scope: opts.scope,
//    client_id: opts.client_id,
//    client_secret: opts.client_secret || opts.secret || opts.password
//  };
//
//  if (opts.secret && opts.password) {
//    payload.client_id = Client.Internal.PREFIX + opts.app;
//    payload.username = opts.username;
//    payload.password = opts.password;
//  }
//  else if (opts.password) {
//    payload.client_id = Client.User.PREFIX + opts.username;
//  }
//  else if (opts.app) {
//    payload.client_id = Client.App.PREFIX + opts.app;
//  }
//
//  if (opts.code) {
//    payload.code = opts.code;
//    payload.redirect_uri = opts.redirectUri;
//  }
//  else if (opts.refreshToken) {
//    payload.refresh_token = opts.refreshToken;
//  }
//
//  return payload;
//};


var GRANTS = {
  client_credentials: {
    validate: function(body) {
      return (
        (
          (!Client.User.PREFIX_RE.test(body.client_id)) &&
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
          !Client.Internal.PREFIX_RE.test(body.client_id) &&
          UnauthorizedClient('Client is not trusted.')
        ) ||
        Scope.validate(body.scope)
      );
    }
  },

  authorization_code: {
    validate: function(body) {
      return (
        (
          !Client.App.PREFIX_RE.test(body.client_id) &&
          UnauthorizedClient('Client is not an app.')
        ) ||
        (
          ('string' !== typeof body.code) &&
          InvalidRequest('Missing authorization code.')
        ) ||
        (
          ('string' !== typeof body.redirect_uri) &&
          InvalidRequest('Missing redirect URI.')
        )
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
