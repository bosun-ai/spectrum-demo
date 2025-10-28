// Jest + RTL + MSW setup for regression tests
import '@testing-library/jest-dom/extend-expect';
import { server } from './testServer';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up once the tests are done.
afterAll(() => server.close());

// Ensure a compatible fetch in Jest/node; prefer node-fetch@2 CommonJS
// isomorphic-fetch can conflict with MSW interceptors; use node-fetch directly
// eslint-disable-next-line global-require
const nodeFetch = require('node-fetch');
// Attach to global for tests
global.fetch = nodeFetch;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;
global.Response = nodeFetch.Response;
