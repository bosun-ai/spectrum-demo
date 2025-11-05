import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
// Simple mock store to satisfy Provider without external deps
const configureStore = () => {
  const getState = () => ({});
  const dispatch = () => {};
  const subscribe = () => () => {};
  return { getState, dispatch, subscribe };
};
import ChannelSettings from '../src/views/channelSettings';

const mockStore = configureStore([]);

// Helper to render the connected + routed component
const renderWithProviders = (
  ui,
  { route = '/community/channel/settings', storeState = {} } = {}
) => {
  const store = configureStore(storeState);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
};

// Build a minimal channel shape matching component expectations
const baseChannel = {
  id: 'channel-1',
  name: 'General',
  isArchived: false,
  channelPermissions: { isModerator: false, isOwner: false },
  community: {
    slug: 'community',
    name: 'Community',
    communityPermissions: { isOwner: false, isModerator: false },
  },
};

describe('ChannelSettings regression', () => {
  it('renders LoadingView when isLoading', () => {
    renderWithProviders(
      <ChannelSettings
        data={{ channel: null }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={true}
        hasError={false}
      />
    );

    // LoadingView renders a generic loading message; match by role or text
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders ErrorView when not loading and no channel', () => {
    renderWithProviders(
      <ChannelSettings
        data={{ channel: null }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={false}
        hasError={true}
      />
    );

    // ErrorView typically shows a fallback heading
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('blocks unauthorized users with permission error and upsell', () => {
    const channel = {
      ...baseChannel,
      channelPermissions: { isModerator: false, isOwner: false },
      community: {
        ...baseChannel.community,
        communityPermissions: { isOwner: false, isModerator: false },
      },
    };

    renderWithProviders(
      <ChannelSettings
        data={{ channel }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={false}
        hasError={false}
      />
    );

    expect(
      screen.getByText(/you don’t have permission to manage this channel\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/return to community settings/i)
    ).toBeInTheDocument();
  });

  it('renders Overview when user has permissions', () => {
    const channel = {
      ...baseChannel,
      channelPermissions: { isModerator: true, isOwner: false },
    };

    renderWithProviders(
      <ChannelSettings
        data={{ channel }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={false}
        hasError={false}
      />
    );

    // Header heading includes channel name and the word Settings
    expect(screen.getByText(/general settings/i)).toBeInTheDocument();
    // Overview renders form labels/fields; check for a known label
    expect(screen.getByText(/channel name/i)).toBeInTheDocument();
  });
});
