// MSW server setup for Jest-based regression tests
// Provides a test server to mock network requests when needed.

const { setupServer } = require('msw/node');

// Define no default handlers; individual tests can import and use server.use(...)
const server = setupServer();

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (i.e. for test isolation).
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

module.exports = { server };
