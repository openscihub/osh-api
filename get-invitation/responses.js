var ResponseSet = require('../lib/response-set');

var responses = new ResponseSet();
responses.add('invalid_invite_token', 'Invalid invitation token format.');
responses.add('bad_invitation', 'Invitation has expired or does not exist.');

module.exports = responses;
