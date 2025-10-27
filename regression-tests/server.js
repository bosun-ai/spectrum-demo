// regression-tests/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';
// Example: You may add handlers if the Button uses fetch/XHR later

export const server = setupServer();
// rest.get('/api/some-endpoint', (req, res, ctx) => res(ctx.json({ hello: 'world' })))

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers after each test for isolation.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
