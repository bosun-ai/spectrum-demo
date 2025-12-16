const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the unconnected component directly to avoid Redux deps
const {
  UnconnectedChannelActions,
} = require('../src/components/entities/profileCards/components/channelActions.js');

// Helper to build minimal props shape required by the component
const buildProps = ({
  isOwner = false,
  isModerator = false,
  isMember = false,
  communitySlug = 'community',
  channelSlug = 'channel',
} = {}) => ({
  channel: {
    slug: channelSlug,
    channelPermissions: { isMember },
    community: {
      slug: communitySlug,
      communityPermissions: { isOwner, isModerator },
    },
  },
});

describe('UnconnectedChannelActions', () => {
  test('shows Settings button for team member when user is member', () => {
    const props = buildProps({ isOwner: true, isMember: true });
    render(React.createElement(UnconnectedChannelActions, props));

    const btn = screen.queryByText('Settings');
    expect(btn).toBeInTheDocument();
    // data-cy should be present when channelPermissions.isMember is true
    expect(btn).toHaveAttribute('data-cy', 'channel-settings-button');
    // link should include /community/channel/settings
    expect(btn).toHaveAttribute('href', '/community/channel/settings');
  });

  test('shows Settings button for team member when user is not member', () => {
    const props = buildProps({ isModerator: true, isMember: false });
    render(React.createElement(UnconnectedChannelActions, props));

    const btn = screen.queryByText('Settings');
    expect(btn).toBeInTheDocument();
    // data-cy should NOT be present when channelPermissions.isMember is false
    expect(btn).not.toHaveAttribute('data-cy');
    expect(btn).toHaveAttribute('href', '/community/channel/settings');
  });

  test('does not show Settings for non-team member', () => {
    const props = buildProps({
      isMember: true,
      isOwner: false,
      isModerator: false,
    });
    render(React.createElement(UnconnectedChannelActions, props));

    // No Settings button because not a team member
    expect(screen.queryByText('Settings')).toBeNull();
  });
});
