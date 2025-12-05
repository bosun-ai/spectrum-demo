// Extend jest-dom matchers
// For older Jest versions, import the built file to avoid expect init issues
try {
  require('@testing-library/jest-dom/dist/extend-expect');
} catch (e) {
  require('@testing-library/jest-dom/extend-expect');
}
// JSDOM under Jest 22 requires URL set to avoid opaque origin
if (typeof window !== 'undefined' && !window.location) {
  // noop
}
// Ensure a valid URL to prevent localStorage SecurityError
try {
  const { JSDOM } = require('jsdom');
  // If global.window exists, set its location href
  if (global.window && global.window.location && !global.window.location.href) {
    global.window.location.href = 'http://localhost/';
  }
} catch (e) {
  // ignore if jsdom internals not exposed
}

// Setup MSW server lifecycle
const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
