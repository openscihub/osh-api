var Route = require('osh-route');
var Username = require('../join/username');

module.exports = new Route({
  path: '/users/<username>',
  params: {
    username: Username.regexp
  }
});
