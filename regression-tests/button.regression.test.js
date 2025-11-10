import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/button';

// A simple regression: ensure Button renders children and respects disabled
test('Button renders label and disables when isLoading', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <Button isLoading onClick={onClick}>
      Click Me
    </Button>
  );

  const btn = screen.getByRole('button', { name: /click me/i });
  expect(btn).toBeInTheDocument();
  expect(btn).toBeDisabled();

  await user.click(btn);
  expect(onClick).not.toHaveBeenCalled();
});
