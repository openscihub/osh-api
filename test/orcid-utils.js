var orcidUtils = exports;

/**
 *  This test expects the following environment variables:
 *
 *    - OSH_HOST
 *
 *  The successful test requires a real authorization code
 *  from the ORCiD sandbox server. See instructions here:
 *  http://support.orcid.org/knowledgebase/articles/179969-methods-to-generate-an-access-token-for-testing#curl
 *
 *
 */

orcidUtils.SIGNIN_URI = 'https://sandbox.orcid.org/signin/auth.json';
orcidUtils.AUTHORIZE_URI = 'https://sandbox.orcid.org/oauth/authorize';
orcidUtils.JSON_AUTHORIZE_URI = 'https://sandbox.orcid.org/oauth/custom/authorize.json';
orcidUtils.EMAIL = 'adamballer@mailinator.com';
orcidUtils.PASSWORD = 'ba11er5e5';
orcidUtils.ORCID = '0000-0002-9718-6141';
orcidUtils.SCOPE = '/authenticate';
orcidUtils.REDIRECT_URI = 'https://developers.google.com/oauthplayground';

//var OSH_ORCID = '0000-0001-8288-8290';
orcidUtils.OSH_CLIENT_ID = 'APP-O9VK4YWREJ7DYYT9';
orcidUtils.SESSION_RE = /JSESSIONID=([^;]+);/;

orcidUtils.getAuthCode = function(opts, callback) {
  var authCode;
  var sessionCookie;
  var accessToken;

  async.series(
    [
      signInToOrcid,
      requestOrcidAuthorization,
      authorizeOrcid,
      getOshAccessToken
    ],
    function(err) {
      callback(err, authCode);
    }
  );

  /**
   *  Get an authorization code from ORCiD sandbox.
   */

  function signInToOrcid(done) {
    request.post(SIGNIN_URI)
    .type('form')
    .send({
      userId: orcidUtils.EMAIL,
      password: orcidUtils.PASSWORD
    })
    .end(function(err, res) {
      if (!err) {
        //console.log(res.header);
        //console.log(res.body);
        var cookies = res.header['set-cookie'] || [];
        var match;
        cookies.forEach(function(cookie) {
          match = match || orcidUtils.SESSION_RE.exec(cookie);
        });
        if (!match) err = new Error('No session cookie.');
        else {
          sessionCookie = match[0];
          console.log('Session cookie: %s', sessionCookie);
        }
      }
      done(err);
    });
  }

  function requestOrcidAuthorization(done) {
    request.get(orcidUtils.AUTHORIZE_URI)
    .set('Cookie', sessionCookie)
    .type('form')
    .accept('*/*')
    .redirects(0)
    .query({
      client_id: orcidUtils.OSH_CLIENT_ID,
      response_type: 'code',
      scope: SCOPE,
      redirect_uri: orcidUtils.REDIRECT_URI
    })
    .end(function(err, res) {
      //console.log(res.status);
      //if (res) {
      //  console.log(res.header);
      //  console.log(res.body);
      //}
      if (!res.ok) err = new Error('ORCiD auth GET');
      done(err);
    });
  }

  function authorizeOrcid(done) {
    var payload = require('./authorize.json');
    payload.clientId.value = orcidUtils.OSH_CLIENT_ID;
    payload.redirectUri.value = orcidUtils.REDIRECT_URI;

    request.post(orcidUtils.JSON_AUTHORIZE_URI)
    .set('Cookie', sessionCookie)
    //.set('Content-Type', 'application/json;charset=UTF-8')
    .send(payload)
    .end(function(err, res) {
      //console.log(res.status);
      //if (res) {
      //  console.log(res.header);
      //  console.log(res.body);
      //}
      if (!err && res.ok) {
        var match = /code=([a-zA-Z0-9]+)/.exec(res.body.redirectUri.value);
        if (!match) err = new Error('No code in redirect_uri');
        else authCode = match[1];
      }
      if (!res.ok) err = new Error('ORCiD');
      done(err);
    });
  }

};
