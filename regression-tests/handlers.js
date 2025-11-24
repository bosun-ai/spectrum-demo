const { rest } = require('msw');

// Define request handlers for MSW; empty for now.
const handlers = [
  // Example:
  // rest.get('/api/health', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
