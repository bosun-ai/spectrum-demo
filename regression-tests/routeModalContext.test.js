const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the context from src/routes.js
const { RouteModalContext } = require('../src/routes.js');

function Consumer() {
  return (
    <RouteModalContext.Consumer>
      {value => (
        <div data-testid="val">
          {value && value.isModal ? 'modal' : 'not-modal'}
        </div>
      )}
    </RouteModalContext.Consumer>
  );
}

test('RouteModalContext provides default isModal=false', () => {
  render(React.createElement(Consumer));
  expect(screen.getByTestId('val').textContent).toBe('not-modal');
});

test('RouteModalContext.Provider overrides isModal', () => {
  const value = { isModal: true };
  render(
    React.createElement(
      RouteModalContext.Provider,
      { value },
      React.createElement(Consumer)
    )
  );
  expect(screen.getByTestId('val').textContent).toBe('modal');
});
