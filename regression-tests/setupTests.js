// Extend Jest DOM assertions
require('@testing-library/jest-dom/extend-expect');

// Polyfill fetch for MSW in Node
require('cross-fetch/polyfill');

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
