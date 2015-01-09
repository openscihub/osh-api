var ResponseSet = require('./response-set');

var responses = new ResponseSet();

responses.add(
  'access_denied',
  'Access denied. Invalid, missing, or expired access token. Check scopes.'
);

var OAuth2 = {
  responses: responses
  TRUSTED_CLIENTS: [
    'app:oshweb'
  ]
};

module.exports = OAuth2;
