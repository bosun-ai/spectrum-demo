const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

test('component renders', () => {
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn' },
    'Click'
  );
  render(element);
  expect(screen.getByTestId('btn')).toBeInTheDocument();
});
