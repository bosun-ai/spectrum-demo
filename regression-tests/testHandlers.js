import { rest } from 'msw';

// Example handlers; adjust to actual endpoints if needed
export const handlers = [
  rest.get('/api/ping', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
