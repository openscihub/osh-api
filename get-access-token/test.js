var getAccessToken = require('../get-access-token');
var expect = require('expect.js');

/**
 *  This test suite, like the others, requires the testing
 *  seed user to be loaded into the API server.
 */

getAccessToken.host = process.env.OSH_HOST;

describe('getAccessToken', function() {
  it('should invoke client_credentials request', function(done) {
    getAccessToken(
      {
        username: 'test',
        secret: 'test',
        scope: 'account'
      },
      function(err, accessToken) {
        console.log(accessToken);
        done(err);
      }
    );
  });
});
