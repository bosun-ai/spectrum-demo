const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Simple component using React.createElement without JSX
function Counter({ initial }) {
  const React2 = React; // avoid shadowing
  const [count, setCount] = React2.useState(initial || 0);
  return React2.createElement(
    'div',
    null,
    React2.createElement('span', { 'data-testid': 'count' }, String(count)),
    React2.createElement(
      'button',
      { onClick: () => setCount(c => c + 1) },
      'Increment'
    )
  );
}

test('Counter increments on click', () => {
  render(React.createElement(Counter, { initial: 1 }));
  expect(screen.getByTestId('count')).toHaveTextContent('1');
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByTestId('count')).toHaveTextContent('2');
});
