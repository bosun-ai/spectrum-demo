const { rest } = require('msw');

// Define handlers here as needed; kept empty for now.
const handlers = [
  // Example: rest.get('/api/health', (req, res, ctx) => res(ctx.status(200))),
];

module.exports = { handlers, rest };
