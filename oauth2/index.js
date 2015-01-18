var ResponseSet = require('../lib/response-set');

var OAuth2 = {};

/**
 *  These responses come from
 *  http://tools.ietf.org/html/rfc6749#section-5.2
 */

var responses = OAuth2.responses = new ResponseSet();
responses.add('invalid_request');

module.exports = OAuth2;
