// regression-tests/button.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../src/components/button/index.js';

// No network requests, so we don't need msw handlers for this button test

describe('Button regression', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies disabled prop', () => {
    render(<Button disabled>Not clickable</Button>);
    expect(screen.getByText('Not clickable')).toBeDisabled();
  });

  it('renders link with href', () => {
    render(<Button href="https://example.com">Go to site</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Go to site');
  });
});
