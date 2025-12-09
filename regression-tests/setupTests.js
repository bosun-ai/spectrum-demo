// Extend Jest with testing-library matchers
require('@testing-library/jest-dom/extend-expect');

// MSW server lifecycle hooks
const { server } = require('./server');

// jsdom in Jest 22 can throw on localStorage for opaque origins; set URL
// and provide a basic localStorage polyfill if necessary
if (typeof window !== 'undefined') {
  try {
    // Define a default URL to avoid opaque origin
    const { URL } = require('url');
    const href = 'http://localhost/';
    if (!window.location || !window.location.href) {
      // jsdom sets location; ensure it has a href
      window.location = new URL(href);
    }
  } catch (err) {
    // ignore
  }
  if (!window.localStorage) {
    const store = {};
    window.localStorage = {
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
    };
  }
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
