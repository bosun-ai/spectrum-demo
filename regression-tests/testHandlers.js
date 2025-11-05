import { rest } from 'msw';

// Example handlers; adjust per component behavior as needed.
export const handlers = [
  rest.get('/health', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
