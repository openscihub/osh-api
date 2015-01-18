var ResponseSet = require('../lib/response-set');
var Action = require('../lib/simple-action');
var Route = require('osh-route');
var merge = require('xtend/immutable');
var Resource = require('../resource');
var pick = require('../lib/pick');

var responses = createInvitation.responses = new ResponseSet();

responses.extend(Resource.responses);
responses.add('invalid_invite_token', 'Invalid invitation token format.');
responses.add('no_invitation', 'Invitation has expired or does not exist.');
responses.add('invalid_lifetime', 'Lifetime should be 1 to 100. Units are days.');

function createInvitation(props, callback) {
  Action(
    merge(createInvitation, {
      payload: pick(props, ['lifetime']),
      accessToken: props.accessToken
    }),
    callback
  );
}

createInvitation.scope = 'account';
createInvitation.method = 'POST';
createInvitation.route = new Route({path: '/invitation'});
createInvitation.lifetime = 7; // a week

/**
 *  Expose for use on server.
 */

createInvitation.validate = function(payload) {
  var lifetime = payload.lifetime;
  if (lifetime) {
    lifetime = parseInt(lifetime);
    if (isNaN(lifetime) || lifetime < 1 || lifetime > 100) {
      return responses.use('invalid_lifetime');
    }
  }
};

module.exports = createInvitation;
