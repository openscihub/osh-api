var api = require('../test/api')({
  getAccessToken: 'get-access-token',
  createInvitation: 'create-invitation',
  joinWithPassword: 'join-with-password'
});


describe('join-with-password', function() {
  if (api.host) {
    var accessToken;
    var invitation;

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

          // Wait for token to take?
          //setTimeout(done, 500);
        }
      );
    });

    before(function(done) {
      api.createInvitation(
        {
          accessToken: accessToken.access_token
        },
        function(err, _invitation) {
          invitation = _invitation;
          done(err);
        }
      );
    });

    it('should work', function(done) {
      api.joinWithPassword(
        {
          username: 'professor',
          password: 'good-news-everyone!',
          realname: 'Hubert J. Farnsworth',
          invitation: invitation.id
        },
        function(err, user) {
          done(err);
        }
      );
    });
  }
});
