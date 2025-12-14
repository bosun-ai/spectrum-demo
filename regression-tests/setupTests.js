// Setup for regression tests
// Extend jest-dom matchers (v6 exports in main index)
try {
  require('@testing-library/jest-dom/extend-expect');
} catch (e) {
  require('@testing-library/jest-dom');
}

// Polyfill fetch for node via cross-fetch
require('cross-fetch/polyfill');

// MSW server lifecycle
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Stub localStorage to avoid jsdom opaque origin issues in Jest 22
if (typeof window !== 'undefined' && !window.localStorage) {
  const storage = (() => {
    let store = {};
    return {
      getItem: key => store[key] || null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: key => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: storage });
}
