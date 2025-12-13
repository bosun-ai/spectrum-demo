// Jest setup for regression tests
require('@testing-library/jest-dom/extend-expect');
const { cleanup } = require('@testing-library/react');
const { server } = require('./server');

// Set JSDOM URL to enable localStorage
if (typeof window !== 'undefined') {
  try {
    const url = 'http://localhost/';
    if (window.location && window.location.href !== url) {
      Object.defineProperty(window, 'location', {
        value: new URL(url),
        writable: true,
      });
    }
  } catch (err) {
    // ignore
  }
}

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
