const { rest } = require('msw');

// Define any API handlers needed for tests; empty for now
const handlers = [
  // Example:
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
