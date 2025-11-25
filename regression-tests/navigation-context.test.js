const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the NavigationContext from the project source
const { NavigationContext } = require('../src/helpers/navigation-context');

function Consumer() {
  const { navigationIsOpen, setNavigationIsOpen } = React.useContext(
    NavigationContext
  );

  return React.createElement(
    'div',
    null,
    React.createElement('span', { 'data-testid': 'is-open' }, String(navigationIsOpen)),
    React.createElement(
      'button',
      {
        'data-testid': 'toggle',
        onClick: () => setNavigationIsOpen(prev => !prev),
      },
      'Toggle'
    )
  );
}

test('NavigationContext provides default values', () => {
  render(React.createElement(Consumer));
  // Default value should be false as defined in the context
  expect(screen.getByTestId('is-open').textContent).toBe('false');
});

test('NavigationContext allows overriding via Provider', () => {
  const value = { navigationIsOpen: true, setNavigationIsOpen: () => {} };
  render(
    React.createElement(
      NavigationContext.Provider,
      { value },
      React.createElement(Consumer)
    )
  );
  expect(screen.getByTestId('is-open').textContent).toBe('true');
});

test('Consumer can update state when provided with setter', () => {
  function Wrapper() {
    const [open, setOpen] = React.useState(false);
    const value = React.useMemo(
      () => ({ navigationIsOpen: open, setNavigationIsOpen: setOpen }),
      [open]
    );
    return React.createElement(
      NavigationContext.Provider,
      { value },
      React.createElement(Consumer)
    );
  }

  render(React.createElement(Wrapper));
  const isOpen = screen.getByTestId('is-open');
  const toggle = screen.getByTestId('toggle');

  // Initially false
  expect(isOpen.textContent).toBe('false');
  // Click to toggle true
  toggle.click();
  expect(isOpen.textContent).toBe('true');
  // Click to toggle false
  toggle.click();
  expect(isOpen.textContent).toBe('false');
});
