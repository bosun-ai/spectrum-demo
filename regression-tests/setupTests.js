// Extend Jest with DOM matchers
require('@testing-library/jest-dom/extend-expect');

// Start the MSW server lifecycle for tests
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
