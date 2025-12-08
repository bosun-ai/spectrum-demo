// Extend Jest matchers
require('@testing-library/jest-dom/extend-expect');
// Polyfill fetch for Node 12 environment
require('cross-fetch/polyfill');
// Ensure jsdom has a non-opaque origin to avoid localStorage SecurityError
// Older jsdom versions used by Jest v22 can throw if URL is not set
if (
  typeof window !== 'undefined' &&
  window.location &&
  window.location.href === 'about:blank'
) {
  try {
    // jsdom exposes reconfigure in newer versions; fallback to setting location
    window.location.href = 'http://localhost/';
  } catch (e) {
    // ignore
  }
}
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
