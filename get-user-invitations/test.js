var getUserInvitations = require('../get-user-invitations');
var expect = require('expect.js');

/**
 *  This test suite, like the others, requires the testing
 *  seed user to be loaded into the API server.
 */


describe('getUserInvitations', function() {
  var PORT = 11235;
  var host = process.env.OSH_HOST;

  if (!host) {
    host = 'localhost:' + PORT;

    /**
     *  Fake server.
     */

    var app = require('express')();
    var responses = getUserInvitations.responses;

    app.get(
      getUserInvitations.route.PATH,
      function(req, res, next) {
        if (!req.headers['authorization']) {
          // Just check for access token existence. Accept any.
          return res.status(401).send({error: 'unauthorized'});
        }
        var username = req.params[0];
        if (username !== 'test') {
          return res.status(401).send(responses.use('invalid_token'));
        }
        res.status(200).send({
          invitations: [{id: 'beef', expires: new Date()}]
        });
      }
    );

    before(function(done) {
      app.listen(PORT, done);
    });
  }

  getUserInvitations.host = host;

  it('should return the test user invites', function(done) {
    getUserInvitations(
      {
        username: 'test',
        accessToken: 'feedadadeer'
      },
      function(err, res) {
        if (err) done(err);
        else {
          expect(res.invitations.length).to.be(1);
          done();
        }
      }
    );
  });

  it('should fail if user does not exist', function(done) {
    getUserInvitations(
      {
        username: 'jest',
        accessToken: 'feedadadeer'
      },
      function(err, user) {
        expect(err).to.be.ok();
        expect(err.message).to.match(/invalid_token/);
        done();
      }
    );
  });
});
