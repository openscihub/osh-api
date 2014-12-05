# `POST /invitations/<token>/link-to-orcid`

Link an invitation to an ORCID iD. If successful, return a token that allows
the creation of an openscihub user via `POST /join?orcid_user=true`.

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

- `orcid_join_token` *string*: A random string to be used in a
  request to the `POST /join` endpoint.
- `orcid_id` *string*: The ORCID iD obtained from ORCID's API.
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
