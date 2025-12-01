const { rest } = require('msw');

// Define handlers here as your app's API evolves.
// Keeping an empty array makes MSW setup work without intercepts.
const handlers = [
  // Example:
  // rest.get('/api/health', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
