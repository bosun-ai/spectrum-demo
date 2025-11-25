// Extend Jest matchers
// Use older extend-expect path for Jest DOM 5
require('@testing-library/jest-dom/extend-expect');

// Start MSW server
const { server } = require('./server');
beforeAll(() => {
  // Work around jsdom opaque origins by setting a URL
  try {
    // If Jest hasn't set a URL, define location and localStorage shims
    if (typeof window !== 'undefined' && !window.location) {
      window.location = { href: 'http://localhost/' };
    }
    if (typeof window !== 'undefined' && !window.localStorage) {
      const store = {};
      window.localStorage = {
        getItem: key => (key in store ? store[key] : null),
        setItem: (key, val) => {
          store[key] = String(val);
        },
        removeItem: key => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach(k => delete store[k]);
        },
      };
    }
  } catch (err) {
    // ignore if jsdom is managed by Jest already
  }
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
