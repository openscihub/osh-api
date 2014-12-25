var ResponseSet = require('../lib/response-set');


var responses = new ResponseSet();
var Realname = {};


/**
 *  Validate realname.
 */

var RealnameString = responses.add({
  message: 'Realname must be a string.'
});
var RealnameTooLong = responses.add({
  message: 'Realname must be fewer than 1024 characters.'
});

Realname.validate = function(realname) {
  if ('string' != typeof realname) return RealnameString();
  if (realname.length > 1024) return RealnameTooLong();
};

Realname.responses = responses;

module.exports = Realname;
