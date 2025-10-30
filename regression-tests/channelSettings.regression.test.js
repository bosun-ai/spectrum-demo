// Regression test for src/views/channelSettings/index.js ActiveView
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
jest.mock('react-helmet-async', () => ({ Helmet: () => null }));

// Component under test: import module and grab the inner class before compose if exposed,
// otherwise mock HOCs to be identity to avoid needing Providers.
jest.mock('react-redux', () => ({ connect: () => x => x }));
jest.mock('react-router', () => ({ withRouter: x => x }));
jest.mock('shared/graphql/queries/channel/getChannel', () => ({
  getChannelByMatch: x => x,
}));
jest.mock('src/components/viewNetworkHandler', () => x => x);

const ChannelSettings = require('src/views/channelSettings').default;

// Helper: build props matching the component's expectations
const buildProps = ({
  pathname = '/community/channel/settings',
  channelOverrides = {},
} = {}) => {
  const baseChannel = {
    id: 'channel-123',
    name: 'General',
    slug: 'general',
    isArchived: false,
    isPrivate: false,
    description: 'Welcome to General',
    channelPermissions: {
      isModerator: true,
      isOwner: false,
    },
    community: {
      slug: 'community',
      name: 'Community',
      isPrivate: false,
      communityPermissions: {
        isOwner: false,
        isModerator: false,
      },
    },
  };

  const channel = { ...baseChannel, ...channelOverrides };

  return {
    data: { channel },
    location: { pathname },
    match: { params: { communitySlug: channel.community.slug } },
    isLoading: false,
    hasError: false,
    dispatch: jest.fn(),
    history: {},
  };
};

describe('ChannelSettings ActiveView regression', () => {
  it('renders Overview when activeTab is settings', () => {
    const props = buildProps({ pathname: '/community/general/settings' });
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ChannelSettings, props)
      )
    );

    // Header should include channel name and archived state if any
    expect(screen.getByText(/General Settings/)).toBeTruthy();

    // Overview renders EditForm which includes SectionTitle "Channel Settings"
    expect(screen.getByText('Channel Settings')).toBeTruthy();
    // And the View Channel link from Location block
    expect(screen.getByText('View Channel')).toBeTruthy();
  });

  it('shows permission error when user lacks permissions', () => {
    const props = buildProps({
      pathname: '/community/general/settings',
      channelOverrides: {
        channelPermissions: { isModerator: false, isOwner: false },
        community: {
          slug: 'community',
          name: 'Community',
          isPrivate: false,
          communityPermissions: { isOwner: false, isModerator: false },
        },
      },
    });

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(ChannelSettings, props)
      )
    );

    expect(
      screen.getByText('You don’t have permission to manage this channel.')
    ).toBeTruthy();
    expect(screen.getByText(/Return to Community settings/)).toBeTruthy();
  });
});
