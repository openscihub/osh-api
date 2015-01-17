var ResponseSet = require('../lib/response-set');

var User = exports;

/**
 *  Password
 */

var Password = User.Password = {
  LENGTH: 6
};


/**
 *  Username
 */

var Username = User.Username = {
  CHARS: 'a-zA-Z0-9-_'
};

Username.RE = new RegExp('^[' + Username.CHARS + ']+$');

var responses = new ResponseSet();
var BadUsername = responses.add('bad_username');
Username.responses = responses;

Username.validate = function(username) {
  if ('string' != typeof username || !username.length) {
    return BadUsername('A username is required.');
  }
  if (username.length > 32) {
    return BadUsername('Username must be 32 characters or fewer.');
  }
  if (!Username.RE.test(username)) {
    return BadUsername('Username must contain only a-z, A-Z, 0-9, -, and/or _.');
  }
};
