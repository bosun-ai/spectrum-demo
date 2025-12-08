const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

test('button renders and can be clicked', () => {
  const onClick = jest.fn();
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick },
    'Click'
  );
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeTruthy();
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});
