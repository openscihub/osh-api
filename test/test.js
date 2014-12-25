var expect = require('expect.js');
var tick = process.nextTick;

describe('Openscihub model', function() {
  describe('Join', function() {
    var Join;
    
    before(function() {
      Join = require('../join');
      //console.log(Join);
    });

    describe('Username', function() {
      var Username;
      
      before(function() {
        Username = Join.Username;
      });

      describe('validate()', function() {
        it('should pass', function() {
          var err = Username.validate('simple');
          expect(err).to.be(undefined);
        });
        it('should fail', function() {
          var err = Username.validate('$imple');
          expect(err).to.be.ok();
          expect(err.message).to.match(/must contain/i);
        });
        it('should fail b/c of length', function() {
          var err = Username.validate('thequickbrownfoxjumpedoverthelazydogagainandagain');
          expect(err).to.be.ok();
          expect(err.message).to.match(/1-32/i);
        });
      });

      describe('urlify()', function() {
        it('should work', function() {
          var username = Username.urlify('˙∆˚¬˚∆ˆ¨©\ƒ\†ƒ©˙√¬˙ˆ¨˙øˆ∆¬˚¬¶•§∞¢£™¢∞§¶•ªºπø˚∆˙©ƒ∂®´ß∑å');
          expect(username).to.match(/^[a-zA-Z0-9-_]+$/);
        });
      });
    });

    describe('Realname', function() {
      var Realname;
      
      before(function() {
        Realname = Join.Realname;
      });

      describe('validate()', function() {
        it('should pass', function() {
          var err = Realname.validate('Duckworth Hogswallow');
          expect(err).to.be(undefined);
        });
      });
    });

    describe('validatePassword()', function() {
      it('should pass', function() {
        var err = Join.validatePassword(';lkjas;duhouhsdf');
        expect(err).to.be(undefined);
      });
    });

  });

  describe('JoinWithOrcid', function() {
    var JoinWithOrcid;
    var cbBio;

    before(function() {
      JoinWithOrcid = require('../join-with-orcid');
      cbBio = require('./cb-bio.json');
    });

    describe('getOrcidBio()', function() {
      var cbOrcid;
      var orcidHost;

      before(function() {
        cbOrcid = '0000-0001-8288-8290';
        orcidHost = JoinWithOrcid.ORCID_PUBLIC_HOST;
      });

      afterEach(function() {
        Join.ORCID_PUBLIC_HOST = orcidHost;
      });

      // Run this test if you wanna make a true request to the
      // ORCID server. Please don't spam them!
      xit('should work', function(done) {
        Join.getOrcidBio(cbOrcid, function(err, bio) {
          if (err) done(err);
          else {
            expect(bio['message-version']).to.be('1.1');
            // Use the real fetched bio for subsequent tests if
            // this test is run.
            cbBio = bio;
            done();
          }
        });
      });

      it('should validate ORCID iD', function(done) {
        Join.getOrcidBio('BADBAD-iD', function(err, bio) {
          expect(err).to.be.ok();
          expect(err.message).to.match(/invalid orcid id/i);
          done();
        });
      });

      it('should error', function(done) {
        // Mock a bad host.
        Join.ORCID_PUBLIC_HOST = 'http://openskyhub.org/';
        Join.getOrcidBio(cbOrcid, function(err, bio) {
          expect(err).to.be.ok();
          expect(err.message).to.match(/could not fetch orcid/i);
          done();
        });
      });
    });

    describe('realnameFromOrcid()', function() {
      it('should return undefined with bad bio', function() {
        var realname = Join.realnameFromOrcidBio({});
        expect(realname).to.be(undefined);
      });

      it('should return given-family', function() {
        var realname = Join.realnameFromOrcidBio(cbBio);
        expect(realname).to.be('Carl Bauer');
      });

      it('should return family-given', function() {
        var realname = Join.realnameFromOrcidBio(cbBio, {familyFirst: true});
        expect(realname).to.be('Bauer Carl');
      });
    });
  });

  describe('link-invitation-to-orcid', function() {
    var LinkInvitationToOrcid;
    var GetInvitation;
    var MockSuccessfulGetInvitation;

    before(function() {
      LinkInvitationToOrcid = require('../link-invitation-to-orcid');
      GetInvitation = LinkInvitationToOrcid.GetInvitation;
      MockSuccessfulGetInvitation = function(token, callback) {
        tick(function() {
          callback({
            code: token ? 0 : 1,
            message: token ? 'Success.' : 'No token.',
            result: token ? {
              "token": token,
              "creator": "bongoplayer42",
              "expires": 29834681912
            } : {}
          });
        });
      };
      MockFailingGetInvitation = function(token, callback) {
        tick(function() {
          callback({
            code: 1,
            message: 'Some error.',
            result: {}
          });
        });
      };
    });

    afterEach(function() {
      // Undo mocking.
      LinkInvitationToOrcid.GetInvitation = GetInvitation;
    });

    describe('validate()', function() {
      it('should pass', function(done) {
        LinkInvitationToOrcid.GetInvitation = MockSuccessfulGetInvitation;
        LinkInvitationToOrcid.validate(
          {
            invitation_token: "afdcaefaceacdafecdaeac",
            orcid_auth_code: 'adede-098234'
          },
          function(res) {
            expect(res.code).to.be(0);
            expect(res.message).to.be('Success.');
            expect(res.result.token).to.be("afdcaefaceacdafecdaeac");
            done();
          }
        );
      });

      it('should fail without auth code', function(done) {
        LinkInvitationToOrcid.GetInvitation = MockSuccessfulGetInvitation;
        LinkInvitationToOrcid.validate(
          {
            invitation_token: "afdcaefaceacdafecdaeac"
          },
          function(res) {
            expect(res.code > 0).to.be.ok();
            expect(res.message).to.match(/missing orcid authorization code/i);
            done();
          }
        );
      });

      it('should fail if token does not exist', function(done) {
        LinkInvitationToOrcid.GetInvitation = MockFailingGetInvitation;
        LinkInvitationToOrcid.validate(
          {
            invitation_token: "afdcaefaceacdafecdaeac",
            orcid_auth_code: 'adefe-029347'
          },
          function(res) {
            expect(res.code).to.be.above(0);
            expect(res.message).to.match(/some error/i);
            done();
          }
        );
      });
    });
  });
});
