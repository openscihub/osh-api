var ResponseSet = require('../lib/response-set');
var Action = require('../lib/simple-action');
var merge = require('xtend/immutable');


function getInvitation(token, callback) {
  Action(
    merge(getInvitation, {
      props: {id: token}
    }),
    callback
  );
}

var responses = getInvitation.responses = new ResponseSet();
responses.add('invalid_invite_token', 'Invalid invitation token format.');
responses.add('bad_invitation', 'Invitation has expired or does not exist.');

getInvitation.access = 'public';
getInvitation.method = 'GET';
getInvitation.route = require('./route');

module.exports = getInvitation;
