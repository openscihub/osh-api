var ResponseSet = require('../lib/response-set');
var Username = require('./username');
var Realname = require('./realname');
var Route = require('osh-route');
var SimpleAction = require('../lib/simple-action');
var merge = require('xtend/immutable');


var joinWithPassword = function(props, callback) {
  SimpleAction(
    merge(joinWithPassword, {
      payload: props
    }),
    callback
  );
};

joinWithPassword.method = 'POST';

var PASSWORD_LENGTH = 6;

var responses = joinWithPassword.responses = new ResponseSet();
responses.extend(Username.responses);
responses.extend(Realname.responses);
responses.add('missing_invitation', 'Missing an invitation.');
responses.add(
  'short_password',
  'Password must be at least ' + PASSWORD_LENGTH + ' characters.'
);
responses.add('password_required', 'Password must be a string.');
responses.add('user_exists', 'User already exists.');


joinWithPassword.route = new Route({path: '/user'});
joinWithPassword.Username = Username;
joinWithPassword.Realname = Realname;


joinWithPassword.validatePassword = function(password) {
  if ('string' != typeof password) return responses.use('password_required');
  if (password.length < PASSWORD_LENGTH) return responses.use('short_password');
};


joinWithPassword.validate = function(payload) {
  return (
    (!payload.invitation && responses.use('missing_invitation')) ||
    Username.validate(payload.username) ||
    Realname.validate(payload.realname) ||
    joinWithPassword.validatePassword(payload.password)
  );
};


module.exports = joinWithPassword;
