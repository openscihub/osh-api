var Client = exports;

Client.User = {
  PREFIX: 'user:',
  GRANT_TYPES: ['client_credentials', 'authorization_code']
};

Client.App = {
  PREFIX: 'app:',
  GRANT_TYPES: ['authorization_code']
};

Client.Internal = {
  PREFIX: 'internal:',
  GRANT_TYPES: ['password']
};

for (var Type in Client) {
  Client[Type].PREFIX_RE = new RegExp('^' + Client[Type].PREFIX);
}
