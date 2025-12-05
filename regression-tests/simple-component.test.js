const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
// Manually import matchers for older jest-dom versions
require('@testing-library/jest-dom');

test('component renders and responds to click', () => {
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
