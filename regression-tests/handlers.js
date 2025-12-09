const { rest } = require('msw');

// Define request handlers here as needed for tests
const handlers = [
  // Example: rest.get('/api/ping', (req, res, ctx) => res(ctx.json({ ok: true })))
];

module.exports = { handlers, rest };
