require('@testing-library/jest-dom/extend-expect');

// Ensure fetch exists in Node test environment (required by MSW)
try {
  // Only polyfill if not present
  if (typeof global.fetch !== 'function') {
    global.fetch = require('cross-fetch');
  }
} catch (err) {
  // ignore
}

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
