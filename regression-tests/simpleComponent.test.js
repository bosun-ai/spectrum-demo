const React = require('react');
const { render, fireEvent } = require('@testing-library/react');

test('component renders', () => {
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn' },
    'Click'
  );
  const { getByTestId } = render(element);
  expect(getByTestId('btn')).toBeInTheDocument();
});
