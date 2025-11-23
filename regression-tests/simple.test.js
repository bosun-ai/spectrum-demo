const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
require('cross-fetch/polyfill');

test('component renders', () => {
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn' },
    'Click'
  );
  render(element);
  expect(screen.getByTestId('btn')).toBeInTheDocument();
});

test('button click updates text', () => {
  function Button() {
    const [label, setLabel] = React.useState('Click');
    return React.createElement(
      'button',
      { 'data-testid': 'btn', onClick: () => setLabel('Clicked') },
      label
    );
  }
  render(React.createElement(Button));
  const btn = screen.getByTestId('btn');
  expect(btn.textContent).toBe('Click');
  fireEvent.click(btn);
  expect(btn.textContent).toBe('Clicked');
});
