require('@testing-library/jest-dom/extend-expect');

// Ensure fetch is available in Node tests for MSW
require('cross-fetch/polyfill');

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
