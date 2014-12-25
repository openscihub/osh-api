# Openscihub API

This package defines the openscihub API via isomorphic javascript modules (and
their corresponding READMEs).  These modules are used on the *production*
openscihub servers to validate API requests (yep, openscihub uses Node.js).

## Installation

```
npm install osh-api
```

## Actions

Here is the list of all openscihub API actions. Get to it!

- [POST /join](join)
- [POST /join-with-orcid](join-with-orcid)
- [GET /invitations/&lt;token&gt;](get-invitation)
- [POST /invitations/&lt;token&gt;/link-to-orcid](link-invitation-to-orcid)

## Responses

Because the Openscihub API uses the OAuth2 framework, its HTTP responses are
modeled after those defined in the standard. See, for example, the [token
endpoint responses](http://tools.ietf.org/html/rfc6749#section-5).

A response is always a JSON object. On success, the object will contain the
requested payload, the format of which will vary depending on the requested
resource.

An error response object will **always** contain the following properties:

- `error` *string*: The error code.
- `error_description` *string*: A short message about the error, usually a
  sentence or two.
- `error_uri` *string*: Not used.

Other properties may exist depending on the resource. These will be
documented.



Successful responses will
return the requested payload in a JSON object, whereas error responses
will return a JSON object with the following properties

will be modeled after those defined in the OAuth2 standard (for example, inspect
the access token endpoint error response format.


Responses to HTTP API requests **and** their Javascript API counterparts (and
many other js helper methods defined on the endpoint interface functions)
take the following form:

```
{
  "code": {integer},
  "message": {string},
  "result": {object}
}
```

where the integer `code` is 0 on success, and positive otherwise.
Such payloads are returned from HTTP requests as a JSON response body and from
javascript methods as a POJO (plain old javascript object).

As a result, javascript API callbacks should take the form:

```js
function(response) {
  if (response.code) {
    // error handling...
  }
  else {
    // success handling...
  }
}
```

Rather than the usual Node.js style:

```js
function(err, result) {
  if (err) {
    // error handling...
  }
  else {
    // success handling...
  }
}
```


## Javascript interfaces

Each API action has a JS interface consisting of an action-function (that
performs the API action using
[superagent](http://visionmedia.github.io/superagent/)) and a set of properties
and helper methods (exposed as properties on the function) that support the
action-function.

The helper properties and functions fall loosely into 3 categories.

- validation
- access permission
- response definition

### Validation

Exposed validation functions are always synchronous and return an API response
if the check fails, or `undefined` if it succeeds. These are quick checks that
prevent obviously invalid requests from incurring a communication latency.

Some validation steps are necessarily asynchronous/time-consuming (like
checking for the existence of a record in a database). It doesn't make
sense to perform these checks in a client, since they will run anyway on
the API server.

However, the responses that may be generated from async checks are still
recorded in the action-function `responses` object. Furthermore, these
responses are exposed on the action-function for use by the server implementing
this API.

#### URI parameters

URI parameter validation failures always result in a generic NotFound
response (no details are given as to the offending parameter). This behavior
mirrors the server's response when it cannot match a
URI to a route.

### Responses

Every action-function has a `responses` property. This is an array-like
object that maps integer response codes to their corresponding (default)
response properties; default properties usually consist of only the response
message.

For example, every single action-function has the following responses
registered:

```js
responses[0] = {message: 'Success.'};
responses[1] = {message: 'Connection error.'};
responses[2] = {message: 'Malformed URI.'};
```

## License

MIT
