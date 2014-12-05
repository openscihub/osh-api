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

## License

MIT
