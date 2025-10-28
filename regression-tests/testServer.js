import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Basic handlers; extend per-test when needed
export const handlers = [
  rest.get('/api/ping', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];

export const server = setupServer(...handlers);

export { rest };
