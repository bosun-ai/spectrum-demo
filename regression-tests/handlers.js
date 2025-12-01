const { rest } = require('msw');

// Define MSW request handlers here as needed for tests.
const handlers = [
  // Example:
  // rest.get('/api/hello', (req, res, ctx) => {
  //   return res(ctx.json({ message: 'world' }));
  // }),
];

module.exports = { handlers };
