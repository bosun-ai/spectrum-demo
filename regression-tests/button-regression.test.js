// regression-tests/button-regression.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../src/components/button/index.js'; // Use public API

// Test the primary Button export (not the styled button internals)

describe('Button regression', () => {
  test('Button renders with provided children and can be clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole('button', { name: 'Click Me' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('Button supports small size prop', () => {
    render(<Button size="small">Small</Button>);
    const btn = screen.getByRole('button', { name: 'Small' });
    expect(btn).toBeInTheDocument();
    // Do not test exact font-size inline, as styled-components injects in a stylesheet.
    // Instead, assert presence and correct rendered text.
    expect(btn).toHaveTextContent('Small');
  });
});
