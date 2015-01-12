var Action = require('../lib/simple-action');
var merge = require('xtend/immutable');


function getInvitation(token, callback) {
  Action(
    merge(getInvitation, {
      props: {id: token}
    }),
    callback
  );
}

getInvitation.access = 'public';
getInvitation.method = 'GET';
getInvitation.route = require('./route');
getInvitation.responses = require('./responses');

module.exports = getInvitation;
