var getUser = require('../get-user');
var expect = require('expect.js');

/**
 *  This test suite, like the others, requires the testing
 *  seed user to be loaded into the API server.
 */


describe('getUser', function() {
  var PORT = 11235;
  var host = process.env.OSH_HOST;

  if (!host) {
    host = 'localhost:' + PORT;

    /**
     *  Fake server.
     */

    var app = require('express')();
    var responses = getUser.responses;

    app.get(
      getUser.route.PATH,
      function(req, res, next) {
        var username = req.params[0];
        if (username !== 'test') {
          res.status(400).send(responses.use('no_user'));
        }
        else {
          res.status(200).send({
            username: 'test',
            realname: null
          });
        }
      }
    );

    before(function(done) {
      app.listen(PORT, done);
    });
  }

  getUser.host = host;

  it('should return the test user', function(done) {
    getUser(
      {username: 'test'},
      function(err, user) {
        if (err) done(err);
        else {
          expect(user.username).to.be('test');
          done();
        }
      }
    );
  });

  it('should fail if user does not exist', function(done) {
    getUser(
      {username: 'jest'},
      function(err, user) {
        expect(err).to.be.ok();
        expect(err.message).to.match(/no_user/);
        done();
      }
    );
  });
});
