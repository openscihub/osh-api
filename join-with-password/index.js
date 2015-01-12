var Username = require('./username');
var Realname = require('./realname');
var Route = require('osh-route');
var SimpleAction = require('../lib/simple-action');
var merge = require('xtend/immutable');
var User = require('../user');

var joinWithPassword = function(props, callback) {
  SimpleAction(
    merge(joinWithPassword, {
      payload: props
    }),
    callback
  );
};

joinWithPassword.method = 'POST';
joinWithPassword.route = new Route({path: '/user'});
joinWithPassword.responses = require('./responses');
joinWithPassword.Username = Username;
joinWithPassword.Realname = Realname;

joinWithPassword.validatePassword = function(password) {
  if ('string' != typeof password) return responses.use('password_required');
  if (password.length < User.PASSWORD_LENGTH) return responses.use('short_password');
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
