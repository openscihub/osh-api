var ResponseSet = require('../lib/response-set');
var Route = require('osh-route');
var OAuth2 = require('../lib/oauth2');
var Action = require('../lib/simple-action');
var merge = require('xtend/immutable');

/**
 *  Properties
 *
 *    - username {required String}
 *    - orcid_auth_code {required String}
 *    - token {required String}: OAuth2 access token.
 *
 */

function linkUserToOrcid(props, callback) {
  Action(
    merge(linkUserToOrcid, {
      props: {username: props.username},
      payload: {orcid_auth_code: props.orcid_auth_code},
      token: props.token
    }),
    callback
  );
};

linkUserToOrcid.method = 'POST';

var responses = new ResponseSet();
responses.extend(OAuth2.responses);
responses.add('no_user', 'User does not exist.');
responses.add('orcid_error', 'ORCiD authentication/authorization failed.');
responses.add('no_auth_code', 'Missing ORCID authorization code.');
linkUserToOrcid.responses = responses;


linkUserToOrcid.route = new Route({
  path: '/orcid-link',
  parent: require('../get-user/route')
});

linkUserToOrcid.access = 'account';

/**
 *  Validate authorization code and retrieve the invitation to
 *  confirm its existence and grab some meta.
 *
 *  Returns
 *
 *    The invitation in the form of an API response fed to
 *    the callback.
 */

linkUserToOrcid.validate = function(payload) {
  return (
    !payload.orcid_auth_code && responses.use('no_auth_code')
  );
};

module.exports = linkUserToOrcid;
