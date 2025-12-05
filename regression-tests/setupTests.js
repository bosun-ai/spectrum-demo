// Extend Jest matchers
require('@testing-library/jest-dom/extend-expect');

// Start MSW server lifecycle hooks
const { server } = require('./server');

// jsdom may run with an opaque origin; provide a simple localStorage mock
if (typeof window !== 'undefined') {
  try {
    // Accessing localStorage can throw in opaque origins
    void window.localStorage;
  } catch (e) {
    const store = {};
    global.localStorage = {
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
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
