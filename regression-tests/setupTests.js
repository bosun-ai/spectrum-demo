// Extend Jest matchers
require('@testing-library/jest-dom/extend-expect');
// Polyfill fetch for Node 12 environment
require('cross-fetch/polyfill');
// Ensure jsdom has a non-opaque origin to avoid localStorage SecurityError
// Older jsdom versions used by Jest v22 can throw if URL is not set
if (
  typeof window !== 'undefined' &&
  typeof window.localStorage === 'undefined'
) {
  const store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: key => (key in store ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: key => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(k => delete store[k]);
      },
    },
    configurable: true,
  });
}
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
