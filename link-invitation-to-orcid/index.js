var ResponseSet = require('../../lib/response-set');
var Route = require('osh-route');
var request = require('superagent');
var GetInvitation = require('../get-invitation');

var responses = new ResponseSet();

var LinkInvitationToOrcid = {
  route: new Route({
    path: '/link-to-orcid',
    parent: require('../get-invitation/route')
  }),
  access: 'public'
};

var NoAuthCode = responses.add({
  message: 'Missing ORCID authorization code.'
});

// GetInvitation is called during validation, so simply add all possible
// responses (besides the successful response, of course) to the current list.

responses.extend(GetInvitation.responses);

LinkInvitationToOrcid.validate = function(props, callback) {
  if (!props.orcid_auth_code) return sync(NoAuthCode());
  GetInvitation(props.token, callback);

  var uri = GetInvitation.route.uri({token: props.token});
  request.get(uri)
  .end(function(err, res) {
    if (err) callback(ErrorFetchingInvitation());
    else {
      res.

    }
  });

  function sync(res) {
    process.nextTick(function() {
      callback(res);
    });
  }
};

LinkInvitationToOrcid.responses = responses;

module.exports = LinkInvitationToOrcid;
