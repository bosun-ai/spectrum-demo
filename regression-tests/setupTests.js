// Jest + RTL + MSW setup for regression tests
import 'jest-dom/extend-expect';
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up once the tests are done.
afterAll(() => server.close());

// Polyfill fetch for node environment
if (typeof window !== 'undefined' && typeof window.fetch === 'undefined') {
  // Use isomorphic-fetch dependency already present in project
  // eslint-disable-next-line global-require
  require('isomorphic-fetch');
}
