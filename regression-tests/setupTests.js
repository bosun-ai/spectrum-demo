const { JSDOM } = require('jsdom');
const { URL } = require('url');

if (!global.URL || typeof global.URL !== 'function') {
  global.URL = URL;
}

const dom = new JSDOM('', { url: 'http://localhost/' });

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
