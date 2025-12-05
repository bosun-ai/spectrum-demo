const { rest } = require('msw');

// Define minimal handlers; none needed for the simple test
const handlers = [
  // Example:
  // rest.get('/api/health', (req, res, ctx) => {
  //   return res(ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
