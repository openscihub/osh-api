var expect = require('expect.js');
var async = require('async');
var api = require('../test/api')({
  getAccessToken: 'get-access-token',
  createInvitation: 'create-invitation',
  joinWithPassword: 'join-with-password'
});


describe('join-with-password', function() {
  if (api.host) {
    var accessToken;
    var invitation;
    var invitationLifetime = 1; // day

    before(function(done) {
      api.getAccessToken(
        {
          grant_type: 'client_credentials',
          client_id: 'user:test',
          client_secret: 'test',
          scope: 'account'
        },
        function(err, _accessToken) {
          if (err) return done(err);
          accessToken = _accessToken;
          done();
        }
      );
    });

    function newInvitation(done) {
      api.createInvitation(
        {
          lifetime: invitationLifetime,
          accessToken: accessToken.access_token
        },
        function(err, _invitation) {
          invitation = _invitation;
          done(err);
        }
      );
    }

    it('should work', function(done) {
      async.series([newInvitation, test], done);

      function test(done) {
        api.joinWithPassword(
          {
            username: 'professor',
            password: 'good-news-everyone!',
            realname: 'Hubert J. Farnsworth',
            invitation: invitation.id
          },
          function(err, user) {
            if (err) return done(err);
            expect(user.username).to.be('professor');
            done();
          }
        );
      }
    });

    it('should fail with a used invitation', function(done) {
      api.joinWithPassword(
        {
          username: 'professor2',
          password: 'good-news-everyone!',
          realname: 'Hubert J. Farnsworth',
          invitation: invitation.id
        },
        function(err, user) {
          expect(err).to.be.ok();
          expect(err.message).to.match(/bad_invitation/);
          done();
        }
      );
    });

    it('should fail with a nonexistent invitation', function(done) {
      api.joinWithPassword(
        {
          username: 'professor2',
          password: 'good-news-everyone!',
          realname: 'Hubert J. Farnsworth',
          invitation: 'deerfeed'
        },
        function(err, user) {
          expect(err).to.be.ok();
          expect(err.message).to.match(/bad_invitation/);
          done();
        }
      );
    });

    it('should fail with an expired invitation', function(done) {
      // How do we test this? Need to change allowed invitation lifetime
      // on server. Shouldn't be able to do this from a client.
      //invitationLifetime = 0;
      // Do test.
      //invitationLifetime = 1;
      done();
    });

    it('should fail if user exists', function(done) {
      async.series([newInvitation, test], done);

      function test(done) {
        api.joinWithPassword(
          {
            username: 'professor',
            password: 'good-news-everyone!',
            realname: 'Hubert J. Farnsworth',
            invitation: invitation.id
          },
          function(err, user) {
            expect(err).to.be.ok();
            expect(err.message).to.match(/user_exists/);
            done();
          }
        );
      }
    });
  }
});
