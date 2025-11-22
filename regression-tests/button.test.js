// regression-tests/button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/button';

function getByText(container, text) {
  return Array.from(container.querySelectorAll('*')).find(
    el => el.textContent === text
  );
}

describe('Button regression', () => {
  it('renders children', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(getByText(container, 'Click me')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(getByText(container, 'Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows as disabled', () => {
    const { container } = render(<Button disabled>Not clickable</Button>);
    const button = getByText(container, 'Not clickable').closest('button');
    expect(button.disabled).toBe(true);
  });

  it('renders as a link if href is passed', () => {
    const { container } = render(
      <Button href="https://example.com">Go</Button>
    );
    const link = container.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.textContent).toBe('Go');
  });
});
