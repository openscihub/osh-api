# POST /oauth2/token

Get an access token using the OAuth2 protocol. Openscihub supports several
grant types.

- A user requests their own

## Supported grant types

## `client_credentials`

A user reads/writes their own resources via access tokens obtained using
the `client_credentials` grant type. This is the simplest way to get an
access token and will likely be used by power users wishing to customize
their own interfaces with openscihub api.



## `password`

The password grant type assumes two actors: a client and a resource owner.
The resource owner gives their password to the client and the client uses it
to obtain an access token.

Openscihub restricts this grant type to official openscihub user interfaces
(the website, mobile apps, native apps, etc.). Therefore, this grant type
should be ignored by people or organizations not affiliated with openscihub.

## `authorization_code`


## Responses

### Success

```
{
  "code": 0,
  "message": "Success.",
  "result": {
    "token": "afdcaefaceacdafecdaeac",
    "creator": "bongoplayer42",
    "expires": 29834681912
  }
}
```


## Javascript

### Installation

```
npm install osh-api
```

### Usage

A user needs an access token to retrieve their own resources.

```js
var GetInvitation = require('osh-api/get-invitation');

// An invitation token; a random string.
var token = 'afacaeadacadfdafdfeacfdafdcaecafdafcaecad';

GetInvitation(token, function(res) {
  console.log(res.message);
  if (res.code) { /* error */ }
  else {
    var invitation = res.result;
    console.log(invitation);
  }
});
```

### GetInvitation.access

Equal to `"public"`.

### GetInvitation.route

An [openscihub Route](https://github.com/openscihub/osh-route) instance.
