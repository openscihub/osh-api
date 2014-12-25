var joinWithOrcid = require('../join-with-orcid');
var orcidUtils = require('../test/orcid-utils');

describe('join-with-orcid', function() {
  var authCode;
  var accessToken;

  beforeEach(function(done) {
    orcidUtils.getAuthCode({}, function(err, code) {
      authCode = code;
      done(err);
    });
  });

  it('should work', function(done) {
    joinWithOrcid.host = process.env.OSH_HOST;
    joinWithOrcid(
      {
        username: 'adam',
        realname: 'Adam the Barbarian',
        orcid_auth_code: authCode
      },
      function(err, user) {
        console.log(user);
        done(err);
      }
    );
  });
});
