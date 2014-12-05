var expect = require('expect.js');

describe('Openscihub model', function() {
  describe('Join', function() {
    var Join = require('../join');
    //console.log(Join);

    describe('validateUsername()', function() {
      it('should pass', function() {
        var err = Join.validateUsername('simple');
        expect(err).to.be(undefined);
      });
      it('should fail', function() {
        var err = Join.validateUsername('$imple');
        expect(err).to.be.ok();
        expect(err.message).to.match(/must contain/i);
      });
      it('should fail b/c of length', function() {
        var err = Join.validateUsername('thequickbrownfoxjumpedoverthelazydogagainandagain');
        expect(err).to.be.ok();
        expect(err.message).to.match(/1-32/i);
      });
    });

    describe('urlifyUsername()', function() {
      it('should work', function() {
        var username = Join.urlifyUsername('˙∆˚¬˚∆ˆ¨©\ƒ\†ƒ©˙√¬˙ˆ¨˙øˆ∆¬˚¬¶•§∞¢£™¢∞§¶•ªºπø˚∆˙©ƒ∂®´ß∑å');
        expect(username).to.match(/^[a-zA-Z0-9-_]+$/);
      });
    });

    describe('validateRealname()', function() {
      it('should pass', function() {
        var err = Join.validateRealname('Duckworth Hogswallow');
        expect(err).to.be(undefined);
      });
    });

    var cbBio = require('./cb-bio.json');

    describe('getOrcidBio()', function() {
      var cbOrcid = '0000-0001-8288-8290';
      var orcidHost = Join.ORCID_PUBLIC_HOST;

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
});
