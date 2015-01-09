var Username = require('./username');
var Route = require('osh-route');

module.exports = new Route({
  path: '/users/<username>',
  params: {
    username: Username.regexp
  }
});
