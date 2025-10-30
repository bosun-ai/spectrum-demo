// Regression test for src/components/button/index.js
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { Button } = require('src/components/button');

describe('Button regression', () => {
  it('renders children and wraps with anchor when href provided', () => {
    render(
      React.createElement(Button, { href: 'https://example.com' }, 'Click Me')
    );
    const anchor = screen.getByText('Click Me').closest('a');
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('https://example.com');
  });

  it('disables when isLoading is true', () => {
    render(React.createElement(Button, { isLoading: true }, 'Loading'));
    const buttonEl = screen.getByText('Loading').closest('button');
    expect(buttonEl).toBeTruthy();
    expect(buttonEl).toBeDisabled();
  });
});
