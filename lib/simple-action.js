var request = require('superagent');
var AsyncCaller = require('./async-caller');

/**
 *  A simple API action-function that leverages SuperAgent for the HTTP
 *  request.
 *
 *  Options:
 *
 *    - validate {Function}: Returns a valid API response if any of
 *      the given props are invalid.
 *    - responses {required ResponseSet}: The set of responses for this API
 *      endponit.
 *    - route {required Route}: Route (osh-route) for forming the URI from
 *      props.
 *    - method {String}: GET/POST. Default is GET.
 */

var SimpleAction = function(opts, callback) {
  var async = AsyncCaller(callback);

  if (opts.payload && opts.validate) {
    var err = opts.validate(opts.payload);
    if (err) return async(ResponseError(err));
  }

  var responses = opts.responses;
  var uri = opts.route.uri(opts.props);
  if (!uri) {
    return async(
      ResponseError(responses.use('not_found'))
    );
  }

  var method = opts.method || 'GET';
  var req = request(method, (opts.host || '') + uri);

  if (opts.accessToken) {
    req.set('Authorization', 'Bearer ' + opts.accessToken);
  }

  if (method === 'POST') req.send(opts.payload);

  req.end(function(err, res) {
    var body = res && res.body;
    if (err) err.body = responses.use('connection_error');
    else if (!res.ok) err = ResponseError(body);
    callback(err, body);
  });
};

function ResponseError(body) {
  var err = new Error(
    (body.error || 'unknown_error') +
    (body.error_description ? ': ' + body.error_description : '')
  );
  err.body = body;
  return err;
}

module.exports = SimpleAction;
