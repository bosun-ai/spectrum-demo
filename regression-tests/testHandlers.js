/* eslint-disable import/no-commonjs */
const { rest } = require('msw');

// Example handlers; adjust per component behavior as needed.
const handlers = [
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
module.exports = { handlers };
