var request = require('superagent');
var AsyncCaller = require('./async-caller');

/**
 *  Returns a simple API action-function that leverages
 *  SuperAgent for the HTTP request.
 *
 *  The resulting function must have the following properties
 *  set on it.
 *
 *    - validate {Function}: Returns a valid API response if any of
 *      the given props are invalid.
 *    - responses {ResponseSet}: The set of responses for this API
 *      endponit.
 *    - route {Route}: Route (osh-route) for forming the URI from
 *      props.
 *    - method {String}: GET/POST.
 */

var SimpleAction = function(opts, callback) {
  var async = AsyncCaller(callback);

  if (opts.payload) {
    var err = opts.validate(opts.payload);
    if (err) return async(err);
  }

  var responses = opts.responses;
  var uri = opts.route.uri(opts.props);
  if (!uri) {
    return async(
      responses.use('not_found')
    );
  }

  var method = opts.method;
  var req = request(method, (opts.host || '') + uri);
  if (opts.token) req.set('x-api-token', opts.token);
  if (method === 'POST') req.send(opts);
  req.end(function(err, res) {
    callback(
      err && responses.use('connection_error'),
      res && res.body
    );
  });
};

module.exports = SimpleAction;
