var Username = require('../join/username');
var Realname = require('../join/realname');
var ResponseSet = require('../lib/response-set');
var AsyncCaller = require('../lib/async-caller');
var Action = require('../lib/simple-action');
var merge = require('xtend/immutable');
var extend = require('xtend/mutable');
var Orcid = require('../lib/orcid');


/**
 *  Properties:
 *
 *    - username {required String}
 *    - orcid_auth_code {required String}
 *    - realname {optional String}
 */

function joinWithOrcid(props, callback) {
  Action(
    merge(joinWithOrcid, {
      payload: props
    }),
    callback
  );
}

// Host, etc.
extend(joinWithOrcid, require('..'));

var responses = new ResponseSet();
responses.extend(Username.responses);
responses.extend(Realname.responses);
responses.extend(Orcid.responses);
responses.add('no_invitation', 'Missing invitation token.');
responses.add('bad_invitation', 'Invitation does not exist or has expired.');
joinWithOrcid.responses = responses;


joinWithOrcid.route = new Route({path: '/orcid-user'});
joinWithOrcid.method = 'POST';
joinWithOrcid.Username = Username;
joinWithOrcid.Realname = Realname;
joinWithOrcid.scope = 'public';

/**
 *  Begin ORCiD stuff.
 */

var QUAD = '[0-9]{4}';

joinWithOrcid.ORCiD_PUBLIC_HOST = 'http://pub.orcid.org/';
joinWithOrcid.ORCiD_ID = new RegExp(
  '^' + QUAD + '-' + QUAD + '-' + QUAD + '-[0-9]{3}[0-9X]$'
);


joinWithOrcid.validateOrcidId = function(orcid) {
  if (!joinWithOrcid.ORCiD_ID.test(orcid)) return InvalidOrcidId();
};


/**
 *  Validate and fetch bio for given ORCiD iD.
 */

joinWithOrcid.getOrcidBio = function(id, callback) {
  var err = joinWithOrcid.validateOrcidId(id);
  if (err) {
    return tick(
      callback.bind(null, err)
    );
  }

  //console.log(joinWithOrcid.ORCiD_PUBLIC_HOST + id + '/orcid-bio');
  request.get(joinWithOrcid.ORCiD_PUBLIC_HOST + id + '/orcid-bio')
  .set('accept', 'application/json')
  .end(function(err, res) {
    if (err || !res.ok) callback(OrcidDoesNotExist());
    else {
      console.log(
        JSON.stringify(res.body, null, 2)
      );
      callback(null, res.body);
    }
  });
};


/**
 *  The bio parameter must be the response body received
 *  from a call to joinWithOrcid.getOrcidBio().
 *
 *  If this fails, it returns undefined. It may fail if the
 *  given bio is malformed or is from an unknown ORCiD API
 *  version.
 */

joinWithOrcid.realnameFromOrcidBio = function(bio, opts) {
  if (!bio) return;
  if (bio['message-version'] === '1.1') {
    var personal;
    var given, family;
    try {
      personal = bio['orcid-profile']['orcid-bio']['personal-details'];
      given = personal['given-names']['value'] || '';
      family = personal['family-name']['value'] || '';
      return (
        (
          opts && opts.familyFirst ?
          family + ' ' + given :
          given + ' ' + family
        )
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
      );
    }
    catch (e) {
      console.log(e);
    }
  }
};


/**
 */

joinWithOrcid.validate = function(props, callback) {
  return (
    (!props.invitation && responses.use('no_invitation')) ||
    (!props.orcid_auth_code && responses.use('no_auth_code')) ||
    Username.validate(props.username) ||
    Realname.validate(props.realname)
  );
};


module.exports = joinWithOrcid;
