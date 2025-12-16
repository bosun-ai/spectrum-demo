const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock styled components used to simple elements
jest.mock('../src/components/entities/profileCards/style', () => ({
  ActionsRowContainer: ({ children, ...rest }) => {
    const React = require('react');
    return React.createElement('div', rest, children);
  },
}));

// Map aliased import to a simple anchor to avoid router deps
jest.mock('../src/components/button', () => ({
  OutlineButton: ({ to, children, ...rest }) => {
    const React = require('react');
    return React.createElement('a', { href: to, ...rest }, children);
  },
}));

const {
  UnconnectedCommunityActions,
} = require('../src/components/entities/profileCards/components/communityActions.js');

// Helper to build minimal props shape required by the component
const buildProps = ({
  isOwner = false,
  isModerator = false,
  isMember = false,
  slug = 'community',
  redirect = false,
} = {}) => ({
  community: {
    slug,
    redirect,
    communityPermissions: { isOwner, isModerator, isMember },
  },
});

describe('UnconnectedCommunityActions', () => {
  test('shows Settings button for team member when user is member', () => {
    const props = buildProps({ isOwner: true, isMember: true, slug: 'alpha' });
    render(React.createElement(UnconnectedCommunityActions, props));

    const btn = screen.queryByText('Settings');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('href', '/alpha/settings');
  });

  test('does not show Settings when user is member but not team', () => {
    const props = buildProps({ isMember: true, slug: 'beta' });
    render(React.createElement(UnconnectedCommunityActions, props));

    expect(screen.queryByText('Settings')).toBeNull();
  });

  test('renders empty padded div when not member and no redirect', () => {
    const props = buildProps({ isMember: false });
    render(React.createElement(UnconnectedCommunityActions, props));

    // No Settings button, but padded div exists
    expect(screen.queryByText('Settings')).toBeNull();
    const divs = screen.getAllByRole('generic');
    // One of the generic divs should have inline style padding: 8px
    expect(divs.some((d) => d.getAttribute('style')?.includes('padding'))).toBe(
      true
    );
  });

  test('renders empty padded div when community has redirect', () => {
    const props = buildProps({ isMember: false, redirect: true });
    render(React.createElement(UnconnectedCommunityActions, props));

    expect(screen.queryByText('Settings')).toBeNull();
    const divs = screen.getAllByRole('generic');
    expect(divs.some((d) => d.getAttribute('style')?.includes('padding'))).toBe(
      true
    );
  });
});
