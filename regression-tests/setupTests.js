// Ensures React Testing Library custom matchers are available
// and MSW server is set up for tests.
/* eslint-disable import/no-commonjs */
require('@testing-library/jest-dom');
const { server } = require('./testServer');
// Polyfill fetch for apollo-upload-client in tests
/* eslint-disable no-undef */
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
