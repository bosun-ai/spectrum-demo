// Jest setup for regression tests
require('@testing-library/jest-dom/extend-expect');

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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
