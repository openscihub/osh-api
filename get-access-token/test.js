var getAccessToken = require('../get-access-token');
var expect = require('expect.js');

/**
 *  This test suite, like the others, requires the testing
 *  seed user to be loaded into the API server.
 */

var host = getAccessToken.host = process.env.OSH_HOST;

describe('getAccessToken', function() {
  if (host) {
    it('should invoke client_credentials request', function(done) {
      getAccessToken(
        {
          grant_type: 'client_credentials',
          client_id: 'user:test',
          client_secret: 'test',
          scope: 'account'
        },
        function(err, accessToken) {
          console.log(accessToken);
          done(err);
        }
      );
    });
  }

  //describe('Payload()', function() {
  //  it('should create valid client_credentials payload from opts', function() {
  //    var payload = getAccessToken.Payload({
  //      username: 'test',
  //      password: 'test',
  //      scope: 'account'
  //    });
  //    expect(payload).to.eql({
  //      grant_type: 'client_credentials',
  //      scope: 'account',
  //      client_id: 'user:test',
  //      client_secret: 'test'
  //    });
  //  });

  //  it('should create valid password payload from opts', function() {
  //    var payload = getAccessToken.Payload({
  //      app: 'osh',
  //      secret: 'ossshhh',
  //      username: 'test',
  //      password: 'test',
  //      scope: 'account'
  //    });
  //    expect(payload).to.eql({
  //      grant_type: 'password',
  //      scope: 'account',
  //      client_id: 'internal:osh',
  //      client_secret: 'ossshhh',
  //      username: 'test',
  //      password: 'test'
  //    });
  //  });

  //  it('should create valid refresh_token payload from opts', function() {
  //    var payload = getAccessToken.Payload({
  //      client: 'internal:osh',
  //      secret: 'ossshhh',
  //      refreshToken: 'deerfeed'
  //    });
  //    expect(payload).to.eql({
  //      grant_type: 'refresh_token',
  //      refresh_token: 'deerfeed',
  //      client_id: 'internal:osh',
  //      client_secret: 'ossshhh'
  //    });
  //  });
  //});

  describe('validate()', function() {
    it('should pass', function() {
      var err = getAccessToken.validate({
        grant_type: 'client_credentials',
        client_id: 'user:test',
        client_secret: 'test',
        scope: 'account'
      });
      expect(err).to.be(undefined);
    });

    it('should fail with unknown grant_type', function() {
      var err = getAccessToken.validate({
        grant_type: 'fluent_credentials',
        client_id: 'user:test',
        client_secret: 'test',
        scope: 'account'
      });
      expect(err && err.error).to.be('unsupported_grant_type');
    });
  });
});
