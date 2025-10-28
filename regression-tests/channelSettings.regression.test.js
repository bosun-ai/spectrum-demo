// Regression test for the ChannelSettings component
import React from 'react';
import { render } from '@testing-library/react';
import ChannelSettings from 'src/views/channelSettings/index.js';

// Fake components for router/redux context. Jest runs in jsdom, just stub minimal props, no need to mount providers.
const baseMatch = {
  params: { communitySlug: 'community', channelSlug: 'channel' },
  path: '/:communitySlug/:channelSlug/settings',
  url: '/community/channel/settings',
};
const baseLocation = { pathname: '/community/channel/settings' };

// Helper: returns full props for ChannelSettings for a given channel and flags
function makeProps({
  channel = null,
  isLoading = false,
  hasError = false,
  custom = {},
} = {}) {
  return {
    data: { channel: channel },
    match: baseMatch,
    location: baseLocation,
    isLoading,
    hasError,
    dispatch: jest.fn(),
    history: {},
    ...custom,
  };
}

describe('ChannelSettings regression', () => {
  it('renders settings page for user with permissions', () => {
    const channel = {
      id: 'ch123',
      name: 'General',
      isArchived: false,
      channelPermissions: { isModerator: true, isOwner: false },
      community: {
        slug: 'community',
        name: 'Community',
        communityPermissions: { isOwner: false, isModerator: false },
      },
    };
    const { getByText } = render(
      <ChannelSettings {...makeProps({ channel })} />
    );
    // Renders header, settings title (shows channel name), etc
    expect(getByText('General Settings')).toBeInTheDocument();
    expect(getByText('Return to Community settings')).toBeInTheDocument();
  });

  it('shows error if user lacks permissions', () => {
    const channel = {
      id: 'ch123',
      name: 'Test Channel',
      isArchived: false,
      channelPermissions: { isModerator: false, isOwner: false },
      community: {
        slug: 'community',
        name: 'Community',
        communityPermissions: { isOwner: false, isModerator: false },
      },
    };
    const { getByText } = render(
      <ChannelSettings {...makeProps({ channel })} />
    );
    // Renders the permission error heading
    expect(
      getByText('You don’t have permission to manage this channel.')
    ).toBeInTheDocument();
  });

  it('shows loading view when loading', () => {
    const { container } = render(
      <ChannelSettings {...makeProps({ isLoading: true })} />
    );
    // Should render loading container
    expect(container.innerHTML).toMatch(/loading/i);
  });

  it('shows error view when not loading or showing channel', () => {
    const { container } = render(
      <ChannelSettings {...makeProps({ channel: null, isLoading: false })} />
    );
    // Should render generic error
    expect(container.innerHTML).toMatch(/error/i);
  });
});
