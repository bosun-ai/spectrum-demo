require('@testing-library/jest-dom/extend-expect');
// Polyfill fetch for apollo-upload-client
try {
  const fetch = require('cross-fetch');
  // cross-fetch exports fetch default
  global.fetch = fetch.default || fetch;
} catch (err) {}
// Ensure a non-opaque origin for jsdom to enable localStorage
try {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
} catch (err) {
  // fallback: do nothing
}

const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
