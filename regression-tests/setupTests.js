// Jest + RTL setup for regression tests
import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';

// MSW server setup
import { setupServer } from 'msw/node';

// Create a shared server; tests can add handlers per-file
export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// jsdom 11 opaque origin fix: provide URL for localStorage
if (typeof window !== 'undefined') {
  const { URL } = require('url');
  // jsdom uses document.defaultView for origin; set location
  window.location = new URL('http://localhost/');
}
