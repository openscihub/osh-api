var getAccessToken = require('../get-access-token');
var expect = require('expect.js');

/**
 *  This test suite, like the others, requires the testing
 *  seed user to be loaded into the API server.
 */

var host = getAccessToken.host = process.env.OSH_HOST;

describe('getAccessToken', function() {
  if (host) {
    describe('client_credentials', function() {
      it('should return access token', function(done) {
        getAccessToken(
          {
            grant_type: 'client_credentials',
            client_id: 'user:test',
            client_secret: 'test',
            scope: 'account'
          },
          function(err, res) {
            expect(res.access_token).to.match(/[0-9a-z]+/);
            done(err);
          }
        );
      });

      it('should fail with bad secret', function(done) {
        getAccessToken(
          {
            grant_type: 'client_credentials',
            client_id: 'user:test',
            client_secret: 'best',
            scope: 'account'
          },
          function(err, res) {
            expect(err && err.message).to.match(/invalid_grant/);
            expect(err.message).to.match(/authentication failed/);
            done();
          }
        );
      });

      it('should fail with unknown client', function(done) {
        getAccessToken(
          {
            grant_type: 'client_credentials',
            client_id: 'user:best',
            client_secret: 'test',
            scope: 'account'
          },
          function(err, res) {
            expect(err && err.message).to.match(/invalid_client/);
            expect(err.message).to.match(/unknown client/i);
            done();
          }
        );
      });
    });

    /**
     *  This test set relies on a trusted client application.
     */

    describe('password', function() {
      it('should return access token', function(done) {
        getAccessToken(
          {
            grant_type: 'password',
            client_id: 'internal:test',
            client_secret: 'test',
            username: 'test',
            password: 'test',
            scope: 'account'
          },
          function(err, res) {
            if (err) return done(err);
            expect(res.access_token).to.match(/[0-9a-z]+/);
            done();
          }
        );
      });

      it('should fail with untrusted client type', function(done) {
        getAccessToken(
          {
            grant_type: 'password',
            client_id: 'user:test', // Client exists, but is not trusted.
            client_secret: 'test',  // Correct secret.
            username: 'test',
            password: 'test',
            scope: 'account'
          },
          function(err, res) {
            expect(err && err.message).to.match(/unauthorized_client/);
            expect(err.message).to.match(/not trusted/i);
            done();
          }
        );
      });

      it('should fail with unknown client', function(done) {
        getAccessToken(
          {
            grant_type: 'password',
            client_id: 'internal:best',
            client_secret: 'test',
            username: 'test',
            password: 'test',
            scope: 'account'
          },
          function(err, res) {
            expect(err && err.message).to.match(/invalid_client/);
            expect(err.message).to.match(/unknown client/i);
            done();
          }
        );
      });
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
