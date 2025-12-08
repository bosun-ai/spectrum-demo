const { rest } = require('msw');

// Define default handlers; can be extended later
const handlers = [
  // Example handler: GET /health
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];

module.exports = { handlers };
