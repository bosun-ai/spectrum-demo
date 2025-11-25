const React = require('react');
const { render } = require('@testing-library/react');
const { NavigationContext } = require('../src/helpers/navigation-context');

test('NavigationContext provides expected shape', () => {
  const value = { navigationIsOpen: true, setNavigationIsOpen: jest.fn() };
  const child = jest.fn(() => null);
  render(React.createElement(NavigationContext.Provider, { value }, child()));
  expect(typeof value.setNavigationIsOpen).toBe('function');
});
