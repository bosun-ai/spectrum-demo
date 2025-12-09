const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

test('button component renders and can be clicked', () => {
  const handleClick = jest.fn();
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick: handleClick },
    'Click'
  );
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
