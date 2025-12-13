const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component under test
const {
  UnconnectedCommunityActions,
} = require('../src/components/entities/profileCards/components/communityActions.js');

// Helper to build a minimal community object matching component expectations
const makeCommunity = ({
  isOwner = false,
  isModerator = false,
  isMember = false,
  slug = 'community',
  redirect = false,
} = {}) => ({
  slug,
  communityPermissions: { isOwner, isModerator, isMember },
  redirect,
});

test('renders Settings button for team members when member', () => {
  const community = makeCommunity({
    isOwner: true,
    isMember: true,
    slug: 'acme',
  });
  const element = React.createElement(UnconnectedCommunityActions, {
    community,
  });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const btn = getByText('Settings');
  expect(btn).toBeInTheDocument();
  const link = btn.closest('a') || btn.parentElement;
  if (link && link.getAttribute) {
    const href = link.getAttribute('href');
    const toAttr = link.getAttribute('to');
    expect(href || toAttr).toBe('/acme/settings');
  }
});

test('does not render Settings when member but not team', () => {
  const community = makeCommunity({
    isMember: true,
    isOwner: false,
    isModerator: false,
  });
  const element = React.createElement(UnconnectedCommunityActions, {
    community,
  });
  const { queryByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  expect(queryByText('Settings')).toBeNull();
});

test('renders empty padded div when not a member', () => {
  const community = makeCommunity({ isMember: false });
  const element = React.createElement(UnconnectedCommunityActions, {
    community,
  });
  const { container } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const div = container.querySelector('div');
  expect(div).toBeInTheDocument();
  expect(div.style.padding).toBe('8px');
});

test('renders empty padded div when redirect is true and not member', () => {
  const community = makeCommunity({ isMember: false, redirect: true });
  const element = React.createElement(UnconnectedCommunityActions, {
    community,
  });
  const { container } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const div = container.querySelector('div');
  expect(div).toBeInTheDocument();
  expect(div.style.padding).toBe('8px');
});
