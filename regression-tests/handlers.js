// Minimal MSW handlers; keeping empty for now per real DB guidance
const { rest } = require('msw');
const handlers = [
  // Example: rest.get('/api/ping', (req, res, ctx) => res(ctx.json({ ok: true }))),
];
module.exports = { handlers, rest };
