module.exports = function(obj, names) {
  var subset = {};
  names.forEach(function(name) {
    if (obj[name] !== undefined) subset[name] = obj[name];
  });
  return subset;
};
