const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Provide NavigationContext since component consumes it
const { NavigationContext } = require('../src/helpers/navigation-context');

// Mock Tooltip to simplify DOM
jest.mock('../src/components/tooltip', () => {
  const ReactLocal = require('react');
  return function TooltipMock({ children }) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, children);
  };
});

// Mock Icon to avoid SVG complexity
jest.mock('../src/components/icon', () => {
  const ReactLocal = require('react');
  return function IconMock() {
    return ReactLocal.createElement('span', { 'data-testid': 'icon' }, 'icon');
  };
});

// Mock NavHead to avoid react-redux store requirement
jest.mock('../src/views/navigation/navHead', () => {
  const ReactLocal = require('react');
  return function NavHeadMock() {
    return ReactLocal.createElement(
      'div',
      { 'data-testid': 'nav-head' },
      'NavHead'
    );
  };
});

// Mock withCurrentUser HOC to pass through props unchanged
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: x => x,
}));

// Import component under test via CommonJS default
const Navigation = require('../src/views/navigation/index.js').default;

// Helper to render Navigation within routing and context
const renderNavigation = (props = {}, { route = '/' } = {}) => {
  const contextValue = {
    navigationIsOpen: true,
    setNavigationIsOpen: () => {},
  };
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(NavigationContext.Consumer, null, () =>
        React.createElement(
          NavigationContext.Provider,
          { value: contextValue },
          React.createElement(Navigation, props)
        )
      )
    )
  );
};

test('renders null on marketing page when signed out', () => {
  // Signed out, visiting root '/' should return null per isViewingMarketingPage
  const { container } = renderNavigation(
    {
      isLoadingCurrentUser: false,
      currentUser: null,
      history: { location: { pathname: '/' } },
    },
    { route: '/' }
  );
  expect(container.firstChild).toBeNull();
});

test('renders explore and login links when no currentUser', () => {
  // Navigate to non-marketing route so nav renders
  renderNavigation(
    {
      isLoadingCurrentUser: false,
      currentUser: null,
      history: { location: { pathname: '/explore' } },
    },
    { route: '/explore' }
  );

  // Navigation wrapper should render and contain links
  expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);
  expect(screen.getByText('Explore')).toBeInTheDocument();
  expect(screen.getByText('Log in')).toBeInTheDocument();
});

test('renders profile link when currentUser is present', () => {
  const currentUser = { id: 'u1', username: 'alice' };
  renderNavigation(
    {
      isLoadingCurrentUser: false,
      currentUser,
      history: { location: { pathname: '/users/alice' } },
    },
    { route: '/users/alice' }
  );

  // Expect navigation to include Profile label
  expect(screen.getByText('Profile')).toBeInTheDocument();
  // Explore also present for signed-in users
  expect(screen.getByText('Explore')).toBeInTheDocument();
});
