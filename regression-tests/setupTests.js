require('@testing-library/jest-dom/extend-expect');
// jsdom v11 on Jest 22 needs URL for localStorage to work
if (typeof window !== 'undefined' && !window.location) {
  // Provide a default URL to avoid opaque origin
  const url = 'http://localhost/';
  delete global.window; // reset
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url });
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
}
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
