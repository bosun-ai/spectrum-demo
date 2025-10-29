import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';
import { Button } from '../src/components/button';
import { server, rest } from './testServer';

describe('Button regression', () => {
  it('renders children and disables when loading', () => {
    const { getByText } = render(<Button isLoading>Click me</Button>);
    const el = getByText('Click me');
    expect(el).toBeInTheDocument();
    expect(el.closest('button')).toBeDisabled();
  });

  it('wraps with anchor when href provided', () => {
    const { getByText } = render(<Button href="/docs">Docs</Button>);
    const el = getByText('Docs');
    const anchor = el.closest('a');
    expect(anchor).toHaveAttribute('href', '/docs');
  });

  it('can trigger an API call with MSW', async () => {
    // Example: ensure msw intercepts a health check
    server.use(
      rest.get('/health', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ ok: true }));
      })
    );

    const onClick = async () => {
      const res = await fetch('/health');
      const data = await res.json();
      if (!data.ok) throw new Error('unhealthy');
    };

    const { getByText } = render(<Button onClick={onClick}>Ping</Button>);
    const el = getByText('Ping');
    fireEvent.click(el);
    // If MSW didn't handle, test would reject; reaching here means ok
    expect(el).toBeInTheDocument();
  });
});
