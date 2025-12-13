const React = require('react');
const { render, fireEvent } = require('@testing-library/react');

function CounterButton() {
  const ReactRef = React; // avoid JSX by using createElement
  const [count, setCount] = ReactRef.useState(0);
  return ReactRef.createElement(
    'button',
    {
      onClick: () => setCount(count + 1),
      'data-testid': 'counter',
    },
    `Count: ${count}`
  );
}

test('CounterButton renders and increments', () => {
  const element = React.createElement(CounterButton, null, null);
  const { getByTestId } = render(element);
  const btn = getByTestId('counter');
  // Avoid jest-dom matcher for broad Jest compatibility
  expect(btn).not.toBeNull();
  expect(btn.textContent).toBe('Count: 0');
  fireEvent.click(btn);
  expect(btn.textContent).toBe('Count: 1');
});
