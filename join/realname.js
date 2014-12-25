var ResponseSet = require('../lib/response-set');
var Realname = exports;

var responses = new ResponseSet();
responses.add('realname_type_error', 'Realname must be a string.');
responses.add('realname_too_long', 'Realname must be fewer than 1024 characters.');
Realname.responses = responses;

Realname.validate = function(realname) {
  if ('string' != typeof realname) return responses.use('realname_type_error');
  if (realname.length > 1024) return responses.use('realname_too_long');
};
