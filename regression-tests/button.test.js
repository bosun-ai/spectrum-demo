import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button';

describe('Button component regression', () => {
  it('renders children and disables when isLoading', async () => {
    render(<Button isLoading>Click me</Button>);
    const btn = screen.getByText('Click me');
    expect(btn).toBeInTheDocument();
    // When isLoading, underlying StyledButton receives disabled
    expect(btn).toHaveAttribute('disabled');
  });

  it('wraps with anchor when href is provided and sets rel/target', async () => {
    render(
      <Button href="https://example.com" target="_blank">
        External
      </Button>
    );
    const link = screen.getByRole('link', { name: /external/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    // rel should be undefined if target is provided per component logic
    expect(link).not.toHaveAttribute('rel');
  });
});
