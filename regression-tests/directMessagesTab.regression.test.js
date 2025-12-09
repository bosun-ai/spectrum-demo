const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter, Route } = require('react-router');

// Mock components and modules that DirectMessagesTab depends on but are unrelated to rendering logic
jest.mock('../src/components/icon', () => {
  const ReactLocal = require('react');
  return function MockIcon() {
    return ReactLocal.createElement('span', { 'data-testid': 'icon' }, 'icon');
  };
});
jest.mock('../src/components/tooltip', () => {
  const ReactLocal = require('react');
  return function MockTooltip(props) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, props.children);
  };
});
jest.mock('../src/components/viewNetworkHandler', () => comp => comp);
jest.mock('../src/components/withCurrentUser', () => comp => comp);
jest.mock('recompose/compose', () => (...funcs) => {
  // Identity compose: return the base component without wrapping
  return component => component;
});

// Mock styled-components theme consumption by style.js indirectly via component render
jest.mock('../shared/theme', () => ({
  bg: { default: '#fff', border: '#eee', wash: '#fafafa' },
  text: {
    default: '#000',
    alt: '#555',
    secondary: '#333',
    placeholder: '#ccc',
  },
  warn: { alt: '#f00' },
  brand: { default: '#00f' },
}));

// Ensure layout constants are defined for viewport checks
jest.mock('../src/components/layout', () => ({
  MEDIA_BREAK: 768,
  NAVBAR_WIDTH: 64,
  NAVBAR_EXPANDED_WIDTH: 240,
  MIN_WIDTH_TO_EXPAND_NAVIGATION: 992,
}));

// Provide a simple NavigationContext implementation used by the component
const { NavigationContext } = require('../src/helpers/navigation-context');

// Import the component under test (default export is composed)
const DirectMessagesTab = require('../src/views/navigation/directMessagesTab')
  .default;

/**
 * Helper to render within MemoryRouter and NavigationContext
 */
const renderWithProviders = (ui, { route = '/' } = {}) => {
  const setNavigationIsOpen = jest.fn();
  return render(
    React.createElement(
      NavigationContext.Provider,
      { value: { setNavigationIsOpen } },
      React.createElement(MemoryRouter, { initialEntries: [route] }, ui)
    )
  );
};

test('renders label and icon; no unread badge when count=0', () => {
  // Wide viewport influences tooltip enablement; not critical to assertions
  Object.defineProperty(window, 'innerWidth', {
    value: 1200,
    configurable: true,
  });

  renderWithProviders(React.createElement(DirectMessagesTab, { count: 0 }), {
    route: '/messages',
  });

  // Label text should render
  expect(screen.getByText(/Messages/i)).toBeInTheDocument();
  // Icon renders via mock
  expect(screen.getByTestId('icon')).toBeInTheDocument();
  // Unread badge should not be present when count is 0
  expect(screen.queryByTestId('unread-dm-badge')).not.toBeInTheDocument();
});

test('shows unread badge when count > 0', () => {
  Object.defineProperty(window, 'innerWidth', {
    value: 800,
    configurable: true,
  });

  renderWithProviders(React.createElement(DirectMessagesTab, { count: 5 }), {
    route: '/messages',
  });

  const badge = screen.getByTestId('unread-dm-badge');
  expect(badge).toBeInTheDocument();
});

test('is inactive outside /messages route and still renders', () => {
  renderWithProviders(React.createElement(DirectMessagesTab, { count: 1 }), {
    route: '/explore',
  });

  // Component still renders link and label
  expect(screen.getByText(/Messages/i)).toBeInTheDocument();
});
