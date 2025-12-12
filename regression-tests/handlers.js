const { rest } = require('msw');

// Placeholder handlers; extend for GraphQL or REST as needed
const handlers = [
  // Example: rest.get('http://localhost:3001/api/health', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({ ok: true }));
  // }),
];

module.exports = { handlers };
