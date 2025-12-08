// @flow
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

test('button renders and clicks', () => {
  const onClick = jest.fn();
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick },
    'Click'
  );
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});
