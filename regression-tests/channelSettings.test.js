import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';

// Mock Head to avoid Helmet runtime requirements in tests
jest.mock('../src/components/head', () => {
  const React = require('react');
  return function MockHead() {
    return <div data-testid="mock-head" />;
  };
});
// Simple mock store to satisfy Provider without external deps
const baseStore = () => {
  const getState = () => ({});
  const dispatch = () => {};
  const subscribe = () => () => {};
  return { getState, dispatch, subscribe };
};
// Import the unwrapped component to avoid Apollo HOC requirement
// Import the raw component class by bypassing the default composed export.
// We require the file and grab the class before compose(connect, withRouter, getChannelByMatch, viewNetworkHandler).
// eslint-disable-next-line import/no-commonjs
const ChannelSettingsModule = require('../src/views/channelSettings/index.js');
const UnwrappedChannelSettings =
  ChannelSettingsModule.ChannelSettings || ChannelSettingsModule.default;

// Helper to render the connected + routed component
const renderWithProviders = (
  ui,
  { route = '/community/channel/settings' } = {}
) => {
  const store = { ...baseStore(), dispatch: jest.fn() };
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ThemeProvider>
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
      <UnwrappedChannelSettings
        data={{ channel: null }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={true}
        hasError={false}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders ErrorView when not loading and no channel', () => {
    renderWithProviders(
      <UnwrappedChannelSettings
        data={{ channel: null }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={false}
        hasError={true}
      />
    );

    // ErrorView heading text from src/components/viewError
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
      <UnwrappedChannelSettings
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
      <UnwrappedChannelSettings
        data={{ channel }}
        match={{ params: { communitySlug: 'community' } }}
        location={{ pathname: '/community/channel/settings' }}
        isLoading={false}
        hasError={false}
      />
    );

    expect(screen.getByText(/general settings/i)).toBeInTheDocument();
    // Avoid querying deeper Apollo-connected Overview internals; assert header and subheading presence
    expect(
      screen.getByText(/return to community settings/i)
    ).toBeInTheDocument();
  });
});
