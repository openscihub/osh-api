var urlify = require('../lib/urlify');
var ResponseSet = require('../lib/response-set');
var request = require('superagent');
var tick = process.nextTick;
var Success = ResponseSet.Success;
var GetInvitation = require('../get-invitation');

var responses = new ResponseSet();

var Join = {
  access: 'public'
};

/**
 *  Validate username.
 */

var USERNAME_CHARS = 'a-zA-Z0-9-_';
var VALID_USERNAME = new RegExp('^[' + USERNAME_CHARS + ']+$');
var INVALID_USERNAME_CHAR = new RegExp('[^' + USERNAME_CHARS + ']', 'g');

var NotAString = responses.add({
  message: 'A username is required.'
});
var BadChars = responses.add({
  message: 'Username must contain only a-z, A-Z, 0-9, -, and/or _.'
});
var TooLong = responses.add({
  message: 'Username must be 1-32 characters long.'
});

Join.validateUsername = function(username) {
  if ('string' != typeof username) return NotAString();
  if (!username.length || username.length > 32) return TooLong();
  if (!VALID_USERNAME.test(username)) return BadChars();
};

Join.urlifyUsername = function(username) {
  return urlify(username).replace(INVALID_USERNAME_CHAR, '-');
};

/**
 *  Validate realname.
 */

var RealnameString = responses.add({
  message: 'Realname must be a string.'
});
var RealnameTooLong = responses.add({
  message: 'Realname must be fewer than 1024 characters.'
});

Join.validateRealname = function(realname) {
  if ('string' != typeof realname) return RealnameString();
  if (realname.length > 1024) return RealnameTooLong();
};




var PASSWORD_LENGTH = 6;
var PasswordTooShort = responses.add({
  message: 'Password must be at least ' + PASSWORD_LENGTH + ' characters.'
});
var PasswordRequired = responses.add({
  message: 'Password must be a string.'
});

Join.validatePassword = function(password) {
  if ('string' != typeof password) return PasswordRequired();
  if (password.length < PASSWORD_LENGTH) return PasswordTooShort();
};


/**
 *  Begin ORCID stuff.
 */

var QUAD = '[0-9]{4}';

Join.ORCID_PUBLIC_HOST = 'http://pub.orcid.org/';
Join.ORCID_ID = new RegExp(
  '^' + QUAD + '-' + QUAD + '-' + QUAD + '-[0-9]{3}[0-9X]$'
);

var InvalidOrcidId = responses.add({
  message: 'Invalid ORCID iD.'
});

Join.validateOrcidId = function(orcid) {
  if (!Join.ORCID_ID.test(orcid)) return InvalidOrcidId();
};

/**
 *  Responses for Join.getOrcidBio().
 */

var OrcidDoesNotExist = responses.add({
  message: 'Could not fetch ORCID biography for iD.'
});

/**
 *  Validate and fetch bio for given ORCID iD.
 */

Join.getOrcidBio = function(id, callback) {
  var err = Join.validateOrcidId(id);
  if (err) {
    return tick(
      callback.bind(null, err)
    );
  }

  //console.log(Join.ORCID_PUBLIC_HOST + id + '/orcid-bio');
  request.get(Join.ORCID_PUBLIC_HOST + id + '/orcid-bio')
  .set('accept', 'application/json')
  .end(function(err, res) {
    if (err || !res.ok) callback(OrcidDoesNotExist());
    else {
      console.log(
        JSON.stringify(res.body, null, 2)
      );
      callback(null, res.body);
    }
  });
};


/**
 *  The bio parameter must be the response body received
 *  from a call to Join.getOrcidBio().
 *
 *  If this fails, it returns undefined. It may fail if the
 *  given bio is malformed or is from an unknown ORCID API
 *  version.
 */

Join.realnameFromOrcidBio = function(bio, opts) {
  if (!bio) return;
  if (bio['message-version'] === '1.1') {
    var personal;
    var given, family;
    try {
      personal = bio['orcid-profile']['orcid-bio']['personal-details'];
      given = personal['given-names']['value'] || '';
      family = personal['family-name']['value'] || '';
      return (
        (
          opts && opts.familyFirst ?
          family + ' ' + given :
          given + ' ' + family
        )
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
      );
    }
    catch (e) {
      console.log(e);
    }
  }
};


// Expose for server to override.
Join.NoInvitation = responses.add({
  message: 'Invitation is invalid or has expired.'
});

/**
 *  Return an error response (NoInvitation) in the callback 
 *  if the given invitation does not exist. Otherwise, return
 *  nothing.
 *
 *  Parameters:
 *
 *    - token {String}
 */

Join.confirmInvitation = function(token, callback) {
  var uri = GetInvitation.uri({token: token});
  request.get(uri)
  .end(function(err, res) {
    if (err || !res.ok) callback(Join.NoInvitation());
    else callback();
  });
};


/**
 *  Returns a successful response if everything checks
 *  out. Returns a valid API response no matter what!
 *
 *  On the client, you can update the page pre-emptively
 *  assuming the request to the server does not fail.
 *
 *  Options:
 *
 *    - payload: Required. The data to send/that was sent.
 *    - 
 */

Join.validate = function(payload, callback) {
  var err = (
    Join.validateUsername(payload.username) ||
    Join.validateRealname(payload.realname) ||
    Join.validateOrcidId(payload.orcid) ||
    Join.validatePassword(payload.password)
  );

  if (err) return async(err);

  if (payload.orcid) {
    tasks.push(
      Join.getOrcidBio.bind(Join, payload.orcid)
    );
  }
  tasks.push(
    Join.confirmInvitation.bind(Join, payload.invite)
  );

  parallel(tasks, function(err) {
    callback(err || Success({
      result: {
        username: payload.username,
        password: payload.password,
        orcid: payload.orcid,
      }
    }));
  });

  function async(res) {
    tick(function() {
      callback(res);
    });
  }
};


Join.responses = responses;


module.exports = Join;
