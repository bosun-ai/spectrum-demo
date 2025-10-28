import React from 'react';
import { render } from '@testing-library/react';
import ChannelSettings from '../src/views/channelSettings';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';

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

const baseMatch = {
  params: {
    communitySlug: 'community',
  },
};

const baseLocation = {
  pathname: '/community/channel/settings',
};

function renderWithAllProviders(ui) {
  const store = createStore((s = {}) => s, {});
  // ApolloClient requires a cache, but can have a no-op link
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: { request: () => {} },
  });
  return render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ApolloProvider client={client}>{ui}</ApolloProvider>
      </Provider>
    </ThemeProvider>
  );
}

describe('ChannelSettings', () => {
  it('renders settings page for user with permissions', () => {
    const props = makeProps({
      channel: {
        name: 'General',
        isArchived: false,
        channelPermissions: {
          isModerator: true,
          isOwner: false,
        },
        community: {
          name: 'Community',
          slug: 'community',
          communityPermissions: {
            isOwner: false,
            isModerator: false,
          },
        },
        isPrivate: false,
      },
    });
    const { getByText } = renderWithAllProviders(
      <ChannelSettings {...props} />
    );
    expect(getByText('General Settings')).toBeTruthy();
    expect(getByText('Return to Community settings')).toBeTruthy();
  });

  it('shows error if user lacks permissions', () => {
    const props = makeProps({
      channel: {
        name: 'General',
        isArchived: false,
        channelPermissions: {
          isModerator: false,
          isOwner: false,
        },
        community: {
          name: 'Community',
          slug: 'community',
          communityPermissions: {
            isOwner: false,
            isModerator: false,
          },
        },
        isPrivate: false,
      },
    });
    const { getByText } = renderWithAllProviders(
      <ChannelSettings {...props} />
    );
    expect(
      getByText('You don’t have permission to manage this channel.')
    ).toBeTruthy();
  });

  it('shows loading view when loading', () => {
    const props = makeProps({ isLoading: true });
    const { container } = renderWithAllProviders(
      <ChannelSettings {...props} />
    );
    expect(container.innerHTML).toMatch(/loading/i);
  });

  it('shows error view when not loading or showing channel', () => {
    const props = makeProps({ isLoading: false, channel: null });
    const { container } = renderWithAllProviders(
      <ChannelSettings {...props} />
    );
    expect(container.innerHTML).toMatch(/error/i);
  });
});
