require('@testing-library/jest-dom/extend-expect');
// Polyfill a URL for jsdom to avoid opaque origin issues with localStorage
if (typeof window !== 'undefined' && !window.location.href) {
  // jsdom v11 sometimes has about:blank which is fine; ensure a http origin
  delete window.location; // remove readonly
  global.window = Object.create(window);
  global.window.location = { href: 'http://localhost/' };
}

const { server } = require('./server');
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
