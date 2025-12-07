const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Simple component using React.createElement to avoid JSX
function SimpleButton(props) {
  const { onClick } = props;
  return React.createElement(
    'button',
    { 'data-testid': 'btn', onClick },
    'Click'
  );
}

test('component renders and handles click', () => {
  const handleClick = jest.fn();
  const element = React.createElement(SimpleButton, { onClick: handleClick });
  render(element);
  const btn = screen.getByTestId('btn');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
