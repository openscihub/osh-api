# `POST /users/<username>/orcid-link`

Link an invitation to an ORCiD iD. If successful, return a token that allows
the creation of an openscihub user via `POST /join?orcid_user=true`.

This is separate from joining with ORCiD because a user should know how
Openscihub plans to

Separation from the join endpoint allows a user to
override how ORCiD-supplied personal information is displayed on Openscihub.


## Request



### Body

- `orcid_auth_code` *required string*: An authorization code obtained from
  ORCID's OAuth2 authorization endpoint. The authorization scope
  must equal `/authenticate /orcid-id/read-public`.

### Example

For the HTTP request

```
```

## Responses

### Success

Returns JSON with the following properties.

- `token` *string*: A random string to be used in a
  request to the `POST /join` endpoint (should be the same as the
  given invitation token).
- `orcid` *object*: A namespace for ORCiD bio information obtained from
  orcid.org.
  - `orcid` *string*: The ORCiD iD obtained from ORCiD's API.
  - `family_name` *string*:
  - `given_name` *string*:
  - Whatever else comes from the `api.orcid.org/<orcid>/orcid-bio` endpoint.
- `expires` *number*: Expiration date of join token in milliseconds
  since Unix epoch. This should match the expiration date of the
  join token.

Example:

```
HTTP/1.1 200 OK
...

{
  "orcid_join_token": "deadbeef"
  "expires": 1417349746000
}
```

### NoInvitation

Returned if the invitation identified by the token in the URL is missing
or has expired.

### ORCiDAuthorizationError



## Javascript

### LinkInvitationToOrcid(props, callback)

Parameters:

- `props.invitation_token` *required String*
- `props.orcid_auth_code` *required String*
- `callback(res)`

Returns an [API response](../#responses) to the callback. On success,
`res.result` contains:

- `orcid_join_token` *String*
- `expires` *Number*: Milliseconds from Unix epoch.

```js
LinkInvitationToOrcid.validate(
  {
    invitation_token: 'deerfeed',
    orcid_auth_code: '1001-1001'
  },
  function(res) {
    console.log(res.result);
    // {
    //   orcid_join_token: 'deaddeer',
    //   expires: 1417830889000
    // }
  }
);
```

### LinkInvitationToOrcid.validate(props, callback)

- `props.invitation_token` *required String*
- `props.orcid_auth_code` *required String*
- `callback(res)`

Returns an [API response](../#responses) to the callback. Assuming
`props.invitation_token` validates, `res` will be a
[GetInvitation](../get-invitation) response. For example, on success,
`res.result` would contain:

- `token` *string*: The invitation token provided in `props`.
- `creator` *string*: The username of the invitation creator.
- `expires` *number*: Invitation expiration date (ms from Unix epoch).

```js
LinkInvitationToOrcid.validate(
  {
    invitation_token: 'deerfeed',
    orcid_auth_code: '1001-1001'
  },
  function(res) {
    console.log(res.result);
    // {
    //   token: 'deerfeed',
    //   creator: 'keith',
    //   expires: 1417830889000
    // }
  }
);
```
