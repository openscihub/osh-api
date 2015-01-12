## `POST /join`

This endpoint creates a new openscihub user using traditional username/password
credentials.

User accounts may be deleted only if there are no persistent effects associated
with the user; otherwise accounts are merely deactivated.  A user "persists"
their account when they, for example,

- submit an article,
- comment on an article, or
- invite other users (that themselves persist their accounts).

It expects to receive a json object in the request body with the
following attributes:

- `username`: A "url-safe" username (comprising the characters: `a-z`, `A-Z`, `0-9`,
  `-`, and/or `_`). This is the unique id of a user. It must
  be a url-safe string because the openscihub webapp puts it in the user's
  homepage url. If the given username is not url-safe, it will be converted
  on the server using [urlify](https://github.com/Gottox/node-urlify).
- `password`: User password.
- `realname` *string*: The user's real name; the one that should show on their
  publications. This is optional; if left
- `invite`: Invitation token. Required.


## Responses

These are the possible responses received from a join request. Properties of
the JSON response body are listed under each. Click for examples.

- [Success](#successful-submission)
  - `message`: `"Success."`
  - `result`: An object containing the `username` and `realname` just
    submitted.
- [Invalid username](#invalid-username)
  - `message`: `"Invalid username."`
  - `result`: An object containing a valid alternative to the given
    `username` (presented under the `username` property).
- [Server error](#server-error)
  - `message`: `"Invalid username."`
  - `result`: Empty object.


### Successful submission

Example of a successful submission.

`POST` body:

```
{
  "realname": "Pinky and The Brain",
  "username": "pinky-brain",
  "password": "conquer",
  "invite": "18294feedbeef"
}
```

and response:

```json
{
  "message": "Success.",
  "result": {
    "realname": "Pinky and The Brain",
    "username": "pinky-brain"
  }
}
```

### Invalid username

Example of a call and response with an invalid `username`.

`POST` body:

```
{
  "realname": "Pinky and The Brain",
  "username": "pinky&brain",
  "password": "conquer",
  "invite": "18294feedbeef"
}
```

Response body on success:

```json
{
  "message": "Invalid username. Alternative suggested.",
  "result": {
    "username": "pinky-brain"
  }
}
```

### Server error

Response body on server error:

```json
{
  "message": "Server error.",
  "result": {}
}
```


## Javascript

### Join.validate(payload, callback)

- `payload`
  - required
  - `payload.username`
    - required
    - string
  - `payload.realname`

Returns API response to callback. On success, the response is the same as a
successful call to [GetInvitation](../get-invitation).
