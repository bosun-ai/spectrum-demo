import '@testing-library/jest-dom/extend-expect';
// Set a valid URL for jsdom to avoid opaque origin
if (typeof window !== 'undefined') {
  try {
    // jsdom 11 uses document.location
    delete window.location;
  } catch (e) {}
  window.location = { href: 'http://localhost/' };
}
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
