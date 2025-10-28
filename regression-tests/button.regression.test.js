import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/button';
import { rest, server } from './testServer';

// Simple regression tests for Button behavior
describe('Button regression', () => {
  test('renders children and is clickable', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('wraps with anchor when href provided', () => {
    render(<Button href="/foo">Go</Button>);
    const link = screen.getByRole('link', { name: /go/i });
    expect(link).toHaveAttribute('href', '/foo');
  });

  test('disabled when isLoading true', () => {
    render(<Button isLoading>Loading</Button>);
    const btn = screen.getByRole('button', { name: /loading/i });
    expect(btn).toBeDisabled();
  });

  test('example MSW call succeeds', async () => {
    // Override handler for this test to ensure msw is wired
    server.use(
      rest.get('/api/ping', (req, res, ctx) => res(ctx.json({ ok: true })))
    );
    const res = await fetch('http://localhost/api/ping');
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });
});
