// Avoid @testing-library/jest-dom due to Node 12 engine constraints in transitive deps
// Basic MSW server lifecycle; can be expanded later if handlers are added
// jsdom in Jest 22 may error on localStorage under opaque origin;
// polyfill minimal localStorage to avoid crashes in simple tests.
if (typeof global.localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
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

try {
  const { server } = require('./server');
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (err) {
  // If MSW is not available, continue without network mocking
}
