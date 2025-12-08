// @flow
require('@testing-library/jest-dom/extend-expect');

// Ensure fetch exists in Node environment for MSW and tests
try {
  // eslint-disable-next-line global-require
  const fetch = require('cross-fetch');
  if (typeof global.fetch === 'undefined') {
    global.fetch = fetch;
  }
} catch (err) {
  // ignore if cross-fetch not available
}

const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
