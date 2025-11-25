const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock Icon to render a simple clickable element with glyph label
jest.mock('src/components/icon', () => {
  const React = require('react');
  return function Icon(props) {
    const { glyph, onClick, 'data-cy': dataCy, hasNavBar } = props;
    return React.createElement(
      'button',
      {
        'data-testid': `icon-${glyph}`,
        'data-cy': dataCy,
        'data-has-navbar': hasNavBar ? 'true' : 'false',
        onClick,
      },
      glyph
    );
  };
});

// Mock styled components used by Menu to simple divs that expose props
jest.mock('src/components/menu/style', () => {
  const React = require('react');
  const passthrough = name => props =>
    React.createElement(
      'div',
      {
        'data-testid': name,
        ...props,
      },
      props.children
    );
  return {
    Wrapper: passthrough('wrapper'),
    MenuContainer: passthrough('menu-container'),
    MenuOverlay: passthrough('menu-overlay'),
    Absolute: passthrough('absolute'),
  };
});

const Menu = require('../src/components/menu').default;

test('Menu toggles open/close and renders children when open', () => {
  render(
    React.createElement(
      Menu,
      { hasNavBar: true, hasTabBar: true, darkContext: false },
      React.createElement('div', { 'data-testid': 'menu-child' }, 'Child')
    )
  );

  // Initially closed: children should not be present
  expect(screen.queryByTestId('menu-child')).toBeNull();

  // Click open icon (glyph menu)
  fireEvent.click(screen.getByTestId('icon-menu'));

  // Children should render when menu is open
  expect(screen.getByTestId('menu-child')).toBeInTheDocument();

  // Absolute wrapper is present; children visible indicates open state
  expect(screen.getByTestId('absolute')).toBeInTheDocument();

  // Close via close icon (glyph view-close)
  fireEvent.click(screen.getByTestId('icon-view-close'));
  expect(screen.queryByTestId('menu-child')).toBeNull();

  // Open again, then close via overlay
  fireEvent.click(screen.getByTestId('icon-menu'));
  expect(screen.getByTestId('menu-child')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('menu-overlay'));
  expect(screen.queryByTestId('menu-child')).toBeNull();
});
