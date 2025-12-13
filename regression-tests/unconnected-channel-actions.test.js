const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component under test
const {
  UnconnectedChannelActions,
} = require('../src/components/entities/profileCards/components/channelActions.js');

// Helper to build a minimal channel object
const makeChannel = ({
  isOwner = false,
  isModerator = false,
  isMember = false,
  communitySlug = 'community',
  channelSlug = 'channel',
} = {}) => ({
  slug: channelSlug,
  community: {
    slug: communitySlug,
    communityPermissions: { isOwner, isModerator },
  },
  channelPermissions: { isMember },
});

test('shows Settings button for team members with correct link when member', () => {
  const channel = makeChannel({ isOwner: true, isMember: true });
  const element = React.createElement(UnconnectedChannelActions, { channel });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const btn = getByText('Settings');
  expect(btn).toBeInTheDocument();
  // OutlineButton with `to` should render inside a StyledLink; ensure link destination
  const link = btn.closest('a') || btn.parentElement; // StyledLink may render as anchor-like
  // Support both StyledLink wrapping and direct button if implementation changes
  if (link && link.getAttribute) {
    const href = link.getAttribute('href');
    const toAttr = link.getAttribute('to');
    expect(href || toAttr).toBe('/community/channel/settings');
  }
});

test('does not show Settings for non-team member', () => {
  const channel = makeChannel({
    isOwner: false,
    isModerator: false,
    isMember: false,
  });
  const element = React.createElement(UnconnectedChannelActions, { channel });
  const { queryByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  expect(queryByText('Settings')).toBeNull();
});

test('shows Settings when moderator, even if not member', () => {
  const channel = makeChannel({
    isModerator: true,
    isMember: false,
    communitySlug: 'c',
    channelSlug: 'ch',
  });
  const element = React.createElement(UnconnectedChannelActions, { channel });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const btn = getByText('Settings');
  expect(btn).toBeInTheDocument();
});
