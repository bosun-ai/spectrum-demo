// Ensure jest-dom matchers are registered for Jest 26
// Some versions require the explicit extend-expect entrypoint
require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
