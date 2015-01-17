var Route = require('osh-route');
var User = require('../user');

module.exports = new Route({
  path: '/users/<username>',
  params: {
    username: User.Username.RE
  }
});
