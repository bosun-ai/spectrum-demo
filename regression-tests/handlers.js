const { rest } = require('msw');

// Example handler; extend to cover real APIs as needed
const handlers = [
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
