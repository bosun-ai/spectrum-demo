const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

test('component renders and clicks', () => {
  function onClick() {
    // noop
  }
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick },
    'Click'
  );
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(btn.textContent).toBe('Click');
});
