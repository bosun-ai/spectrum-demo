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
    const { getByText } = renderActions({
      channelPermissions: { isMember: true },
      community: { communityPermissions: { isOwner: true } },
    });

    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders settings button without data attribute for team non-members', () => {
    const { getByText } = renderActions({
      channelPermissions: { isMember: false },
      community: { communityPermissions: { isModerator: true } },
    });

    expect(getByText('Settings')).toBeTruthy();
  });

  it('hides settings button for non team members', () => {
    const { queryByText } = renderActions({
      channelPermissions: { isMember: true },
    });

    expect(queryByText('Settings')).toBeFalsy();
  });
});
