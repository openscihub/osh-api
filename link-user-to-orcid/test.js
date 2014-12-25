var linkUserToOrcid = require('../link-user-to-orcid');
var async = require('async');
var request = require('superagent');
var orcidUtils = require('../test/orcid-utils');


describe('link-user-to-orcid', function() {
  var authCode;
  var accessToken;

  beforeEach(function(done) {
    orcidUtils.getAuthCode({}, function(err, code) {
      authCode = code;
      done(err);
    });
  });

  beforeEach(getOshAccessToken);

  it('should work', function(done) {
    linkUserToOrcid(
      {
        username: 'adam',
        orcid_auth_code: authCode,
        token: accessToken
      },
      function(err, orcid) {
        console.log(orcid);
        done(err);
      }
    );
  });

  function getOshAccessToken(done) {
    request.post(process.env.OSH_HOST + '/oauth2/token')
    .type('form')
    .send({
      grant_type: 'client_credentials',
      client_id: 'user:adam',
      client_secret: PASSWORD
    })
    .end(function(err, res) {
      if (!err && res.ok) {
        accessToken = res.body.access_token;
      }
      else if (!err) err = new Error('OSH');
      done(err);
    });
  }

});
