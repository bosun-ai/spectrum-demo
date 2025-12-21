const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

function CounterButton() {
  const [count, setCount] = React.useState(0);

  return React.createElement(
    'button',
    {
      onClick: () => setCount(previous => previous + 1),
      'data-testid': 'counter-button',
    },
    `Counter: ${count}`
  );
}

describe('CounterButton', () => {
  it('increments when clicked', () => {
    render(React.createElement(CounterButton));

    const button = screen.getByTestId('counter-button');

    expect(button).toHaveTextContent('Counter: 0');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toHaveTextContent('Counter: 2');
  });
});
