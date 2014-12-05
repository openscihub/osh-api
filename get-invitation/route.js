var Route = require('osh-route');
module.exports = new Route({
  path: '/invitations/<token>',
  params: {
    token: /^[a-z0-9]+$/
  }
});
