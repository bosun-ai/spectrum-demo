// Extend Jest DOM matchers
require('@testing-library/jest-dom/extend-expect');

// Start MSW server for tests
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
