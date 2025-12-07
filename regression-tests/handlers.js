const { rest } = require('msw');

// Define handlers as needed; keeping empty for now
const handlers = [
  // Example:
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
