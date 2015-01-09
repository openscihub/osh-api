var ResponseSet = require('../lib/response-set');
var request = require('superagent');
var tick = process.nextTick;
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

var responses = new ResponseSet();
responses.extend(Username.responses);
responses.extend(Realname.responses);
responses.add('missing_invitation', 'Missing an invitation.');
responses.add(
  'short_password',
  'Password must be at least ' + PASSWORD_LENGTH + ' characters.'
);
responses.add('password_required', 'Password must be a string.');
joinWithPassword.responses = responses;


joinWithPassword.route = new Route({path: '/user'});
joinWithPassword.Username = Username;
joinWithPassword.Realname = Realname;


joinWithPassword.validatePassword = function(password) {
  if ('string' != typeof password) return responses.use('password_required');
  if (password.length < PASSWORD_LENGTH) return responses.use('short_password');
};


joinWithPassword.validate = function(props) {
  return (
    (!props.invitation && responses.use('missing_invitation')) ||
    Username.validate(props.username) ||
    Realname.validate(props.realname) ||
    joinWithPassword.validatePassword(props.password)
  );
};


module.exports = joinWithPassword;
