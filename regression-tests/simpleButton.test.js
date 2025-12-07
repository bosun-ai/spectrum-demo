const React = require('react');
const { render, fireEvent } = require('@testing-library/react');

test('component renders and clicks', () => {
  const handleClick = jest.fn();
  const element = React.createElement(
    'button',
    { 'data-testid': 'btn', onClick: handleClick },
    'Click'
  );
  const { getByTestId } = render(element);
  const btn = getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
