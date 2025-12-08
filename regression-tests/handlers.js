// @flow
const { rest } = require('msw');

// Define empty handlers for now; extend as needed.
const handlers = [
  // Example:
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
