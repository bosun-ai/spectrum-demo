// MSW server setup
const { setupServer } = require('msw/node');
const { rest } = require('msw');

// Example handler; tests can override with server.use
const server = setupServer(
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  })
);

module.exports = { server, rest };
