const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

function SimpleCounter() {
  const [count, setCount] = React.useState(0);
  return React.createElement(
    'div',
    null,
    React.createElement('p', { 'data-testid': 'count' }, `Count: ${count}`),
    React.createElement(
      'button',
      { onClick: () => setCount(count + 1) },
      'Increment'
    )
  );
}

describe('SimpleCounter regression', () => {
  it('increments the count when clicking the button', () => {
    render(React.createElement(SimpleCounter));
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });
});
