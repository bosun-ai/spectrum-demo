import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Example handler; tests can override per-case
export const handlers = [
  rest.get('/api/example', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];

export const server = setupServer(...handlers);
export { rest } from 'msw';
