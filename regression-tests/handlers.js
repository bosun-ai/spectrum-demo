const { rest } = require('msw');

// No network handlers yet; add as needed for tests
const handlers = [
  // Example:
  // rest.get('/api/health', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // })
];

module.exports = { handlers, rest };
