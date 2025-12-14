require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');

// Ensure a non-opaque origin so localStorage is accessible in jsdom
try {
  if (typeof window !== 'undefined' && window.location) {
    // If href is empty, set it to a valid http URL
    if (!window.location.href || window.location.href === 'about:blank') {
      window.location.href = 'http://localhost/';
    }
  }
} catch (e) {
  // Swallow errors; only matters for tests touching localStorage
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
