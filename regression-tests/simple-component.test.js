const React = require('react');
const { render, fireEvent, screen } = require('@testing-library/react');
// Avoid touching localStorage or location in tests

// Simple component without JSX to avoid Babel
function Counter(props) {
  const [count, setCount] = React.useState(props.initial || 0);
  return React.createElement(
    'div',
    null,
    React.createElement('span', { 'data-testid': 'count' }, String(count)),
    React.createElement(
      'button',
      { onClick: () => setCount(c => c + 1) },
      'increment'
    )
  );
}

describe('Counter component', () => {
  it('renders and increments on click', () => {
    render(React.createElement(Counter, { initial: 1 }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });
});
