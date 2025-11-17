import '@testing-library/jest-dom/extend-expect';
// Provide a URL to jsdom to enable localStorage
if (typeof window !== 'undefined' && !window.location.href) {
  // jsdom 11+ supports setting URL via document
  window.document = window.document || {};
}
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'location', {
    value: { href: 'http://localhost/' },
  });
}
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
