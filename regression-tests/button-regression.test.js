// regression-tests/button-regression.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as Button from '../src/components/button/index.js'; // Exports a variety of buttons

// We'll test the base StyledButton and ensure it renders and reacts

describe('Button regression', () => {
  test('StyledButton renders with provided children and can be clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button.StyledButton onClick={handleClick}>Click Me</Button.StyledButton>
    );
    const btn = screen.getByRole('button', { name: 'Click Me' });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('StyledButton supports small size prop', () => {
    render(<Button.StyledButton size="small">Small</Button.StyledButton>);
    const btn = screen.getByRole('button', { name: 'Small' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveStyle('font-size: 15px');
  });
});
