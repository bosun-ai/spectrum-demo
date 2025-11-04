const { setupServer } = require('msw/node');
const { rest } = require('msw');

// Define default handlers used across regression tests.
const handlers = [
  rest.get('/api/ping', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];

// Setup requests interception with the given handlers.
const server = setupServer(...handlers);

module.exports = { server, rest };
