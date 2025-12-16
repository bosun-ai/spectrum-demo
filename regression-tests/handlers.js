const { rest } = require('msw');

// Define handlers as needed; empty for now since tests focus on simple components.
const handlers = [
  // Example:
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
