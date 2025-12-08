// @flow
const { rest } = require('msw');

// Define empty handlers array for now; extend as APIs are added
const handlers = [
  // Example:
  // rest.get('/api/example', (req, res, ctx) => {
  //   return res(ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers, rest };
