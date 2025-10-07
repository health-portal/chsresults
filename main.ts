import * as speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({ length: 20 });
const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

const isValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token,
  window: 10,
});

console.log(isValid);
