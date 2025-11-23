// Regression test for the Button component
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/button/index';

describe('Button regression', () => {
  it('renders children and responds to click', () => {
    const onClick = jest.fn();
    const { getByText } = render(<Button onClick={onClick}>Click me</Button>);
    const btn = getByText('Click me');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('applies disabled prop', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const btn = getByText('Disabled');
    expect(btn.closest('button')).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
