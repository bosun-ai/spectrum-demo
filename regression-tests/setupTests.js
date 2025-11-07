// Jest + RTL setup for regression tests
import 'raf/polyfill';
import 'isomorphic-fetch';
import '@testing-library/jest-dom/extend-expect';

// MSW server setup
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Example default handlers; individual tests can override
export const server = setupServer(
  // Mock a generic JSON endpoint to avoid real network calls in components
  rest.get('/api/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
