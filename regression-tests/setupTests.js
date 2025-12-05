// Extend Jest matchers when available; fallback silently if not installed
try {
  require('@testing-library/jest-dom/extend-expect');
} catch (e) {
  // jest-dom may not be present in older env; proceed without it
}

// Start MSW server lifecycle hooks (disabled: msw not installed in this env)
let server;
try {
  server = require('./server').server;
} catch (e) {
  server = null;
}

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

if (server) {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
