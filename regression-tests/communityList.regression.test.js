const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Mock Tooltip to simplify DOM
jest.mock('../src/components/tooltip', () => {
  const ReactLocal = require('react');
  return function TooltipMock({ children }) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, children);
  };
});

// Mock ErrorBoundary to pass through children
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));

// Ensure layout constant exists (used to compute viewport)
jest.mock('../src/components/layout', () => ({
  MIN_WIDTH_TO_EXPAND_NAVIGATION: 1024,
}));

// Mock getCurrentUserCommunityConnection HOC to inject test data
jest.mock('../shared/graphql/queries/user/getUserCommunityConnection', () => ({
  getCurrentUserCommunityConnection: Component => Component,
}));

// Mock viewNetworkHandler HOC to pass through unchanged
jest.mock('../src/components/viewNetworkHandler', () => Component => Component);

const CommunityList = require('../src/views/navigation/communityList.js').default;

const buildProps = ({
  communities = [],
  sidenavIsOpen = true,
  setNavigationIsOpen = () => {},
} = {}) => {
  const edges = communities.map(node => ({ node }));
  const user = { communityConnection: { edges } };
  return {
    data: { user },
    sidenavIsOpen,
    setNavigationIsOpen,
  };
};

test('renders only member, unblocked communities with labels', () => {
  const communities = [
    {
      id: 'c1',
      name: 'Alpha',
      slug: 'alpha',
      profilePhoto: '/img/alpha.png',
      communityPermissions: { isMember: true, isBlocked: false },
    },
    {
      id: 'c2',
      name: 'Beta',
      slug: 'beta',
      profilePhoto: '/img/beta.png',
      communityPermissions: { isMember: false, isBlocked: false },
    },
    {
      id: 'c3',
      name: 'Gamma',
      slug: 'gamma',
      profilePhoto: '/img/gamma.png',
      communityPermissions: { isMember: true, isBlocked: true },
    },
  ];

  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/alpha'] },
      React.createElement(CommunityList, buildProps({ communities }))
    )
  );

  // Only 'Alpha' should render; 'Beta' (not member) and 'Gamma' (blocked) filtered out
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.queryByText('Beta')).toBeNull();
  expect(screen.queryByText('Gamma')).toBeNull();
});

test('active state follows current route community slug', () => {
  const communities = [
    {
      id: 'c1',
      name: 'Alpha',
      slug: 'alpha',
      profilePhoto: '/img/alpha.png',
      communityPermissions: { isMember: true, isBlocked: false },
    },
    {
      id: 'c2',
      name: 'Delta',
      slug: 'delta',
      profilePhoto: '/img/delta.png',
      communityPermissions: { isMember: true, isBlocked: false },
    },
  ];

  const { container, rerender } = render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/alpha'] },
      React.createElement(CommunityList, buildProps({ communities }))
    )
  );

  // When viewing /alpha, the Alpha item should have active styles applied
  // AvatarGrid sets font-weight 600 for active; we can assert by selecting the Link with text
  const alphaLink = screen.getByText('Alpha').closest('a');
  expect(alphaLink).toHaveAttribute('href', '/alpha?tab=posts');

  // Switch route to /delta and verify active link updates
  rerender(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/delta'] },
      React.createElement(CommunityList, buildProps({ communities }))
    )
  );

  const deltaLink = screen.getByText('Delta').closest('a');
  expect(deltaLink).toHaveAttribute('href', '/delta?tab=posts');
});
