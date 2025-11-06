import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/button';

describe('Button component regression', () => {
  it('renders children and respects disabled/isLoading', () => {
    render(<Button isLoading>Click me</Button>);
    const btn = screen.getByText('Click me');
    expect(btn).toBeInTheDocument();
    expect(btn.closest('button')).toBeDisabled();
  });

  it('wraps with anchor when href provided', () => {
    render(
      <Button href="https://example.com" target="_self">
        Visit
      </Button>
    );
    const link = screen.getByText('Visit').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_self');
  });
});
