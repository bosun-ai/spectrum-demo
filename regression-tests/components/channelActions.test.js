const React = require('react');
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

const renderActions = (overrides = {}) =>
  render(
    React.createElement(UnconnectedChannelActions, {
      channel: {
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
      },
    })
  );

const getSettingsButton = getByTestId =>
  getByTestId('channel-settings-button', {}, { exact: false });

const findButtonByText = (getByTextFunc, text) => getByTextFunc(text, { exact: false });

describe('UnconnectedChannelActions', () => {
  it('shows settings button with data attribute when team member and already joined', () => {
    const { getByTestId } = renderActions({
      channelPermissions: { isMember: true },
      community: { communityPermissions: { isOwner: true } },
    });

    expect(getByTestId('channel-settings-button')).toBeInTheDocument();
  });

  it('shows settings button without data attribute for team member non-member state', () => {
    const { getByText } = renderActions({
      channelPermissions: { isMember: false },
      community: { communityPermissions: { isModerator: true } },
    });

    const button = findButtonByText(getByText, 'Settings');
    expect(button.closest('a')).toHaveAttribute('href', '/acme/general/settings');
  });

  it('hides settings button for non team members', () => {
    const { queryByText } = renderActions({
      channelPermissions: { isMember: true },
    });

    expect(queryByText('Settings')).toBeNull();
  });
});
