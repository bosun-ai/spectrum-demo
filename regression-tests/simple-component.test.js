const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Ensure window has a non-opaque origin before tests run
beforeAll(() => {
  if (typeof window !== 'undefined') {
    try {
      const { URL } = require('url');
      const href = 'http://localhost/';
      if (!window.location || !window.location.href) {
        window.location = new URL(href);
      }
    } catch (err) {}
  }
});

test('button component renders and can be clicked', () => {
  const handleClick = jest.fn();
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick: handleClick },
    'Click'
  );
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
