const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Simple, clear behavior: button increments a counter label when clicked
function CounterButton() {
  let count = 0;
  const handleClick = () => {
    count += 1;
    // Update the DOM manually to avoid needing React state for this simple test
    const label = document.querySelector('[data-testid="count-label"]');
    if (label) label.textContent = String(count);
  };

  return React.createElement(
    'div',
    null,
    React.createElement('span', { 'data-testid': 'count-label' }, '0'),
    React.createElement(
      'button',
      { 'data-testid': 'inc-btn', onClick: handleClick },
      'Inc'
    )
  );
}

test('CounterButton renders and increments on click', () => {
  render(React.createElement(CounterButton));
  const label = screen.getByTestId('count-label');
  const btn = screen.getByTestId('inc-btn');
  expect(label).toBeInTheDocument();
  expect(label.textContent).toBe('0');
  fireEvent.click(btn);
  expect(label.textContent).toBe('1');
  fireEvent.click(btn);
  expect(label.textContent).toBe('2');
});
