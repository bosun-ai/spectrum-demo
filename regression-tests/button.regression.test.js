import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button';

describe('Button regression', () => {
  it('renders children and respects disabled/isLoading', async () => {
    const user = userEvent.setup();

    const handleClick = jest.fn();
    const { rerender } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();

    await user.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={handleClick} isLoading>
        Click me
      </Button>
    );
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();

    rerender(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('wraps with anchor when href provided', () => {
    render(<Button href="https://example.com">Go</Button>);
    const link = screen.getByRole('link', { name: /go/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
