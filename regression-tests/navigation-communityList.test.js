// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the unwrapped component by requiring default and accessing the base
// The exported component is composed with HOCs; for regression we mount the
// composed component with expected props and routing context.
const CommunityList = require('../src/views/navigation/communityList').default;

const makeUserData = () => ({
  user: {
    communityConnection: {
      edges: [
        {
          node: {
            id: 'c1',
            name: 'First Community',
            slug: 'first',
            profilePhoto: '/img/default_community.svg',
            communityPermissions: { isMember: true, isBlocked: false },
          },
        },
        {
          node: {
            id: 'c2',
            name: 'Second Community',
            slug: 'second',
            profilePhoto: '/img/default_community.svg',
            communityPermissions: { isMember: true, isBlocked: false },
          },
        },
        {
          node: {
            id: 'c3',
            name: 'Blocked Community',
            slug: 'blocked',
            profilePhoto: '/img/default_community.svg',
            communityPermissions: { isMember: true, isBlocked: true },
          },
        },
        {
          node: {
            id: 'c4',
            name: 'Not A Member',
            slug: 'nomember',
            profilePhoto: '/img/default_community.svg',
            communityPermissions: { isMember: false, isBlocked: false },
          },
        },
      ],
    },
  },
});

test('renders only member and unblocked communities and marks active', () => {
  const data = makeUserData();
  const setNavigationIsOpen = jest.fn();

  // Use MemoryRouter to provide Route matching context; set initial entry to 
  // a community path to mark it active.
  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/first'] },
      React.createElement(CommunityList, {
        data,
        sidenavIsOpen: true,
        setNavigationIsOpen,
      })
    )
  );

  // Blocked and non-member communities should not render labels
  expect(screen.queryByText('Blocked Community')).toBeNull();
  expect(screen.queryByText('Not A Member')).toBeNull();

  // Member communities should render labels
  expect(screen.getByText('First Community')).toBeInTheDocument();
  expect(screen.getByText('Second Community')).toBeInTheDocument();

  // Active state should apply to the matching community; we can assert
  // that the link for the active community exists and has the correct href.
  const activeLink = screen.getByText('First Community').closest('a');
  expect(activeLink).toHaveAttribute('href', '/first?tab=posts');
});
