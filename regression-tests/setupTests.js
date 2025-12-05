// Extend Jest matchers
require('@testing-library/jest-dom/extend-expect');

// Start MSW server lifecycle hooks
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
