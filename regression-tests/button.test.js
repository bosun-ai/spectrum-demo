// regression-tests/button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/button';

function noop() {}

describe('Button regression', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows as disabled', () => {
    render(<Button disabled>Not clickable</Button>);
    expect(screen.getByText('Not clickable')).toHaveAttribute('disabled');
  });

  it('renders as a link if href is passed', () => {
    render(<Button href="https://example.com">Go</Button>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Go');
  });
});
