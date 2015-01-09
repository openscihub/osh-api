var createInvitation = require('../create-invitation');
var getAccessToken = require('../test/get-access-token');

/**
 *  Prereqs:
 *
 *    - user
 *    - invitation linked to user
 */

describe('create-invitation', function() {
  var accessToken;

  before(function(done) {
    getAccessToken({scope: 'account'}, function(err, tok) {
      accessToken = tok;
    });
  });

  it('should work', function(done) {
    createInvitation(
      {
        accessToken: accessToken
      },
      function(err, invitation) {
        console.log(invitation);
        done(err);
      }
    );
  });
});
