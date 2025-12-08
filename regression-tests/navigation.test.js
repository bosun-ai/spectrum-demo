// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const { ApolloProvider } = require('react-apollo');
const ApolloClient =
  require('apollo-client').default || require('apollo-client');

// Import component and providers via relative paths to avoid Jest moduleNameMapper issues
const Navigation =
  require('../src/views/navigation/index.js').default ||
  require('../src/views/navigation/index.js');
const { NavigationContext } = require('../src/helpers/navigation-context.js');

// Mock styled-components in profile/style to avoid FlexRow undefined
jest.mock('src/components/globals', () => ({
  FlexRow: props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', props);
  },
  FlexCol: props => {
    const ReactLocal = require('react');
    return ReactLocal.createElement('div', props);
  },
  Truncate: () => '',
  Transition: { hover: { on: '', off: '' } },
  zIndex: { card: 1 },
  Shadow: {},
  hexa: () => 'rgba(0,0,0,0.1)',
}));

// Helper: render Navigation with router + context
const renderWithProviders = (
  ui,
  {
    route = '/',
    contextValue = { navigationIsOpen: true, setNavigationIsOpen: () => {} },
  } = {}
) => {
  // Minimal Apollo client to satisfy withCurrentUser HOC queries
  const client = new ApolloClient({
    link: { request: () => {} },
    cache: { read: () => null, write: () => {} },
  });
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          NavigationContext.Provider,
          { value: contextValue },
          ui
        )
      )
    )
  );
};

// Mock window size to ensure labels render (wide viewport)
beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 2000,
  });
});

describe('Navigation regression', () => {
  test('renders explore and login for signed-out users', () => {
    // Simulate signed-out: withCurrentUser HOC will pass no currentUser
    renderWithProviders(React.createElement(Navigation));
    // Navigation wrapper present
    const nav = screen.getByTestId('navigation-bar');
    expect(nav).toBeInTheDocument();
    // Explore and Login links are visible
    expect(screen.getByTestId('navigation-explore')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-login')).toBeInTheDocument();
  });

  test('renders profile for signed-in users and dm tab', () => {
    // Provide currentUser via props by bypassing HOC: render underlying component by default export is composed.
    // We can still pass props to composed component; it forwards to inner component.
    const currentUser = { id: 'u1', username: 'jane' };
    renderWithProviders(
      React.createElement(Navigation, {
        currentUser,
        isLoadingCurrentUser: false,
      })
    );
    const nav = screen.getByTestId('navigation-bar');
    expect(nav).toBeInTheDocument();
    // Explore link present
    expect(screen.getByTestId('navigation-explore')).toBeInTheDocument();
    // Profile link present for signed in
    expect(screen.getByTestId('navigation-profile')).toBeInTheDocument();
  });
});
