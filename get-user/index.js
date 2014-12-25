var Username = require('../join/username');
var ResponseSet = require('../lib/response-set');
var extend = require('xtend/mutable');
var request = require('superagent');

var responses = new ResponseSet();

responses.extend(Username.responses);

function GetUser(props, callback) {
  var uri = GetUser.route.uri({username: props.username});
  request.get(uri)
  .end(function(err, res) {

  });
}

extend(GetUser, {
  access: 'public',
  validateUsername: Username.validate,
  responses: responses,
  route: new Route({
    path: '/users/<username>',
    params: {
      username: Username.validate
    }
  })
});

module.exports = GetUser;
