require('@testing-library/jest-dom/extend-expect');
// Ensure fetch is available in Node test environment for MSW when needed
require('cross-fetch/polyfill');
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
