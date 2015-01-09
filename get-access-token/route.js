var Route = require('osh-route');
module.exports = new Route({
  path: '/invitations/<token>',
  params: {
    token: /^[0-9a-f]+$/
  }
});
