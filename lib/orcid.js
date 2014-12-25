var ResponseSet = require('./response-set');
var Orcid = exports;


var responses = new ResponseSet();
responses.add('no_auth_code', 'Missing ORCiD authorization code.');
responses.add('invalid_orcid', 'Invalid ORCiD iD.');
responses.add('orcid_error', 'ORCiD authentication/authorization failed.');
Orcid.responses = responses;
