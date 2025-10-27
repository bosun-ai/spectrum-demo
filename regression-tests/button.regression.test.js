import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/button';

// A regression test for the basic Button component behaviors
// MSW is not used since Button does not make requests; included for suite setup if needed later

describe('Button regression', () => {
  it('renders children and responds to clicks', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    const btn = getByText('Click me');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const btn = getByText('Disabled');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  it('renders as <a> when href present', () => {
    const { getByText } = render(
      <Button href="https://example.com">Go to Example</Button>
    );
    // Should render a link containing the button
    const link = getByText('Go to Example').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
