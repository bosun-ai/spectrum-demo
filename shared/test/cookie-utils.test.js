// @flow
import jwt from 'jsonwebtoken';
import { signCookie } from '../cookie-utils';

const apiTokenSecret = 'test-api-token-secret';
const cookie = 'session-cookie-value';

it('signs cookie claims with HS256', () => {
  process.env.API_TOKEN_SECRET = apiTokenSecret;

  const token = signCookie(cookie);
  const payload = jwt.verify(token, apiTokenSecret, { algorithms: ['HS256'] });
  const decodedToken = jwt.decode(token, { complete: true });

  expect(payload).toMatchObject({ cookie });
  expect(decodedToken).toMatchObject({ header: { alg: 'HS256' } });
});
