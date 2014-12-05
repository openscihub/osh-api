# GET /invitations/&lt;token&gt;

Inspect the details of an invitation token, such as its creator and the
expiration date.

## Responses

### Success

```
{
  "code": 0,
  "message": "Success.",
  "result": {
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
