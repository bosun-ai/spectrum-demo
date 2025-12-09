// Extend Jest with testing-library matchers
require('@testing-library/jest-dom/extend-expect');

// MSW server lifecycle hooks
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
