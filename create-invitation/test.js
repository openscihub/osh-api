var createInvitation = require('../create-invitation');
var getAccessToken = require('../get-access-token');
var expect = require('expect.js');

/**
 *  Prereqs:
 *
 *    - user
 *    - invitation linked to user
 */

var host = createInvitation.host = process.env.OSH_HOST;

describe('create-invitation', function() {
  if (host) {
    describe('request', function() {
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
  }

  describe('validate()', function() {
    it('should pass', function() {
      var err = createInvitation.validate({
        lifetime: 33 //days
      });
      expect(err).to.be(undefined);
    });

    it('should fail for long lifetime', function() {
      var err = createInvitation.validate({
        lifetime: 333 //days
      });
      expect(err && err.error).to.be('invalid_lifetime');
    });
  });
});
