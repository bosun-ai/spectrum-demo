const React = require('react');
const { MemoryRouter } = require('react-router-dom');
const { render } = require('@testing-library/react');
const {
  UnconnectedChannelActions,
} = require('../../src/components/entities/profileCards/components/channelActions');

const baseChannel = {
  slug: 'general',
  channelPermissions: {
    isMember: false,
  },
  community: {
    slug: 'acme',
    communityPermissions: {
      isOwner: false,
      isModerator: false,
    },
  },
};

const buildChannel = (overrides = {}) => ({
  ...baseChannel,
  ...overrides,
  community: {
    ...baseChannel.community,
    ...(overrides.community || {}),
    communityPermissions: {
      ...baseChannel.community.communityPermissions,
      ...((overrides.community && overrides.community.communityPermissions) || {}),
    },
  },
  channelPermissions: {
    ...baseChannel.channelPermissions,
    ...(overrides.channelPermissions || {}),
  },
});

const renderActions = overrides =>
  render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(UnconnectedChannelActions, {
        channel: buildChannel(overrides),
      })
    )
  );

describe('UnconnectedChannelActions', () => {
  it('renders settings button with data attribute when member and on team', () => {
    const { getByTestId } = renderActions({
      channelPermissions: { isMember: true },
      community: { communityPermissions: { isOwner: true } },
    });

    const button = getByTestId('channel-settings-button');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/acme/general/settings');
  });

  it('renders settings button without data attribute for team non-members', () => {
    const { getByText, queryByTestId } = renderActions({
      channelPermissions: { isMember: false },
      community: { communityPermissions: { isModerator: true } },
    });

    expect(queryByTestId('channel-settings-button')).toBeNull();
    const button = getByText('Settings');
    expect(button.closest('a')).toHaveAttribute('href', '/acme/general/settings');
  });

  it('hides settings button for non team members', () => {
    const { queryByText } = renderActions({
      channelPermissions: { isMember: true },
    });

    expect(queryByText('Settings')).toBeNull();
  });
});
