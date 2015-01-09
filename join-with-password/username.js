var urlify = require('../lib/urlify');
var ResponseSet = require('../lib/response-set');


var responses = new ResponseSet();
var Username = {};

/**
 *  Validate username.
 */

var USERNAME_CHARS = 'a-zA-Z0-9-_';
var VALID_USERNAME = new RegExp('^[' + USERNAME_CHARS + ']+$');
var INVALID_USERNAME_CHAR = new RegExp('[^' + USERNAME_CHARS + ']', 'g');

responses.add('username_required', 'A username is required.');
responses.add('username_too_long', 'User must be 1-32 characters long.');
responses.add('bad_username_chars', 'Username must contain only a-z, A-Z, 0-9, -, and/or _.');

Username.validate = function(username) {
  if ('string' != typeof username) return responses.use('username_required');
  if (!username.length || username.length > 32) return responses.use('username_too_long');
  if (!VALID_USERNAME.test(username)) return responses.use('bad_username_chars');
};

Username.urlify = function(username) {
  return urlify(username).replace(INVALID_USERNAME_CHAR, '-');
};

Username.regexp = VALID_USERNAME;
Username.responses = responses;

module.exports = Username;
