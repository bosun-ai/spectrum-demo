const { setupServer } = require('msw/node');
const { rest } = require('msw');

// Provide a default example handler; tests can override via server.use
const server = setupServer(
  // Example endpoint used by some components; can be replaced in tests
  rest.get('/api/example', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  })
);

module.exports = { server, rest };
