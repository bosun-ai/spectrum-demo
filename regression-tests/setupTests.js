require('@testing-library/jest-dom/extend-expect');

// Ensure fetch is available in Node tests for MSW
require('cross-fetch/polyfill');

// Provide a valid URL to avoid jsdom opaque origin issues
const { URL } = require('url');
const url = new URL('http://localhost/');
if (!global.window.location || global.window.location.href !== url.href) {
  delete global.window.location;
  global.window.location = url;
}

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
