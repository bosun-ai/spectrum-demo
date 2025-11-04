// Jest + RTL setup for regression tests
const { server } = require('./testServer');
const { configure } = require('@testing-library/react');

// Reduce fake timers and other noise
configure({ asyncUtilTimeout: 3000 });

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (ie. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
