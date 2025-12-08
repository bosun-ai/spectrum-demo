// Extend jest with custom matchers
require('@testing-library/jest-dom/extend-expect');

// Start MSW server
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
