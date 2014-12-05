var ResponseSet = require('../lib/response-set');
var AsyncCaller = require('../lib/async-caller');
var AjaxErrorResponse = require('../lib/ajax-error-response');
var request = require('superagent');

var responses = new ResponseSet();

var InvalidTokenFormat = responses.add({
  message: 'Invalid invitation token format.'
});
var AjaxError = responses.add(AjaxErrorResponse);

function GetInvitation(token, callback) {
  var async = AsyncCaller(callback);
  var uri = GetInvitation.route.uri({token: token});
  if (!uri) return async(InvalidTokenFormat());

  request.get(uri)
  .end(function(err, res) {
    callback(err ? AjaxError() : res.body);
  });
}

GetInvitation.access = 'public';
GetInvitation.route = require('./route');


GetInvitation.NoInvitation = responses.add({
  message: 'Invitation has expired or does not exist.'
});

GetInvitation.responses = responses;

module.exports = GetInvitation;
