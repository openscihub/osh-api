var ResponseSet = require('../lib/response-set');
var extend = require('xtend/mutable');
var Action = require('../lib/simple-action');
var userRoute = require('../get-user/route');
var Route = require('osh-route');
var Resource = require('../resource');

function getUserInvitations(props, callback) {
  Action(
    extend(
      {
        props: {username: props.username},
        accessToken: props.accessToken
      },
      getUserInvitations
    ),
    callback
  );
}

//var responses = getUserInvitations.responses = new ResponseSet();
//responses.extend(Resource.responses);

getUserInvitations.responses = Resource.responses;
getUserInvitations.scope = 'account';
getUserInvitations.route = new Route({
  path: '/invitations',
  parent: userRoute
});

module.exports = getUserInvitations;
