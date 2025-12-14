const { rest } = require('msw');

// Define handlers here if/when needed for tests
const handlers = [
  // Example: rest.get('http://localhost:3001/api/status', (req, res, ctx) => res(ctx.json({ ok: true }))),
];

module.exports = { handlers, rest };
