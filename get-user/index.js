var User = require('../user');
var ResponseSet = require('../lib/response-set');
var extend = require('xtend/mutable');
var Action = require('../lib/simple-action');


function getUser(props, callback) {
  Action(
    extend({props: props}, getUser),
    callback
  );
}

var responses = new ResponseSet();
responses.extend(User.Username.responses);
responses.add('no_user', 'User does not exist.');

getUser.route = require('./route');
getUser.responses = responses;

module.exports = getUser;
