var Client = exports;

Client.User = {
  PREFIX: 'user:'
  GRANT_TYPES: ['client_credentials', 'authorization_code']
};

Client.App = {
  PREFIX: 'app:'
  GRANT_TYPES: ['authorization_code']
};

Client.Internal = {
  PREFIX: 'internal:',
  GRANT_TYPES: ['password']
};

for (var Type in Client) {
  Client[Type].PREFIX_RE = new RegExp('^' + Client[Type].PREFIX);
}

Client.USER_PREFIX = 'user:';
Client.USER_PREFIX_RE = new RegExp('^' + Client.USER_PREFIX);

Client.APP_PREFIX = 'app:';
Client.APP_PREFIX_RE = new RegExp('^' + Client.APP_PREFIX);

Client.USER_APP_PREFIX = 'app:';
Client.USER_APP_PREFIX_RE = new RegExp('^' + Client.USER_APP_PREFIX);
