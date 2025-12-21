const { JSDOM } = require('jsdom');

let dom;

try {
  dom = new JSDOM('', { url: 'http://localhost/' });
} catch (error) {
  // Retry with legacy URL API fallback for older jsdom versions
  const { URL } = require('url');
  const originalURL = global.URL;
  global.URL = URL;
  dom = new JSDOM('', { url: 'http://localhost/' });
  global.URL = originalURL;
}

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;
global.XMLHttpRequest = dom.window.XMLHttpRequest;

require('@testing-library/jest-dom/extend-expect');
const { server } = require('./server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
