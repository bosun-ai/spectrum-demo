const { rest } = require('msw');

// Define request handlers here as needed for component tests
const handlers = [
  // Example: rest.get('/api/health', (req, res, ctx) => res(ctx.json({ ok: true }))),
];

module.exports = { handlers, rest };
