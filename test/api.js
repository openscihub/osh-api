module.exports = function(actions) {
  var host = process.env.OSH_HOST;
  for (var name in actions) {
    actions[name] = require('../' + actions[name]);
    actions[name].host = host;
  }
  actions.host = host;
  return actions;
};
