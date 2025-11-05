// Setup for RTL and MSW within regression tests
// Jest 22 does not support automatic cleanup from RTL; we call cleanup manually when needed.

// React Testing Library setup
const { configure } = require('react-testing-library');
configure({ testIdAttribute: 'data-test-id' });

// MSW setup for JSDOM
const { setupServer } = require('msw/node');
const { rest } = require('msw');

// Example default handler; tests can override by re-listening
const server = setupServer(
  // placeholder; individual tests can use server.use(...)
  rest.get('http://localhost/api/ping', (req, res, ctx) => {
    return res(ctx.json({ ok: true }));
  })
);

// make server available in tests via global
global.msws = { server, rest };

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
