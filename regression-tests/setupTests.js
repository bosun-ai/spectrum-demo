// Extend Jest matchers
// For older jest-dom versions, main entry extends expect
require('@testing-library/jest-dom');

// Start MSW server
const { server } = require('./server');
beforeAll(() => {
  // Work around jsdom opaque origins by setting a URL
  try {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('', { url: 'http://localhost/' });
    global.window = dom.window;
    global.document = dom.window.document;
  } catch (err) {
    // ignore if jsdom is managed by Jest already
  }
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
