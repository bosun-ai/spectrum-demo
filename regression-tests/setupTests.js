// Extend jest-dom matchers
require('@testing-library/jest-dom/extend-expect');

// Setup MSW server lifecycle
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
