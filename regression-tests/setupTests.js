// Extend jest with DOM assertions
require('@testing-library/jest-dom/extend-expect');

// Start MSW for tests
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
