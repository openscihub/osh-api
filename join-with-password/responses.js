var ResponseSet = require('../lib/response-set');
var Username = require('../join-with-password/username');
var Realname = require('../join-with-password/realname');
var User = require('../user');

var responses = new ResponseSet();

responses.extend(Username.responses);
responses.extend(Realname.responses);
responses.extend(require('../get-invitation/responses'));
responses.add('missing_invitation', 'Missing an invitation.');
responses.add('bad_invitation', 'Invitation has expired or does not exist.');
responses.add(
  'short_password',
  'Password must be at least ' + User.PASSWORD_LENGTH + ' characters.'
);
responses.add('password_required', 'Password must be a string.');
responses.add('user_exists', 'User already exists.');

module.exports = responses;
