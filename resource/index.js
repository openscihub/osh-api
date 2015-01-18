var ResponseSet = require('../lib/response-set');
var OAuth2 = require('../oauth2');

var Resource = exports;

var responses = Resource.responses = new ResponseSet();
responses.extend(OAuth2.responses);
responses.add('invalid_token');
responses.add('insufficient_scope');
