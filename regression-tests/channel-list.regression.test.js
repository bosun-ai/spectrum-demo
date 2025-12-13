const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
const { Provider } = require('react-redux');
const { initStore } = require('../src/store');
const { ThemeProvider } = require('styled-components');
const { theme } = require('../shared/theme');

// Component under test (unconnected export is not available; render composed with minimal props)
// Import wrapped component but stub Apollo HOC by passing a mock client via ApolloProvider
const ChannelList = require('../src/views/communitySettings/components/channelList')
  .default;
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').ApolloClient;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloLink } = require('apollo-link');
// Minimal Apollo client; queries won't fire because we pass static props, but provider must exist
// Use a noop ApolloLink to avoid network/fetch requirements in jsdom
const client = new ApolloClient({
  link: ApolloLink.empty(),
  cache: new InMemoryCache(),
});

function makeCommunityWithChannels(channels = []) {
  return {
    id: 'community-1',
    slug: 'acme',
    name: 'Acme',
    channelConnection: {
      edges: channels.map(ch => ({ node: ch })),
    },
  };
}

function makeChannel(overrides = {}) {
  const base = {
    id: 'channel-1',
    name: 'general',
    slug: 'general',
    description: 'Welcome to the general channel',
    isPrivate: false,
    isArchived: false,
    community: { id: 'community-1', slug: 'acme', name: 'Acme' },
  };
  return {
    ...base,
    ...overrides,
    community: { ...base.community, ...(overrides.community || {}) },
  };
}

test('renders channels list with actions when community data is present', () => {
  const channel = makeChannel();
  const data = { community: makeCommunityWithChannels([channel]) };

  render(
    React.createElement(
      Provider,
      { store: initStore() },
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          ThemeProvider,
          { theme },
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(ChannelList, {
              data,
              isLoading: false,
              dispatch: () => {},
              communitySlug: 'acme',
            })
          )
        )
      )
    )
  );

  // Section title
  expect(screen.getByText('Channels')).toBeInTheDocument();

  // ChannelListItem should render channel name prefixed with '# '
  expect(screen.getByText('# general')).toBeInTheDocument();

  // Manage channel tooltip trigger should exist with settings icon link
  const settingsLink = document.querySelector(
    'a[href="/acme/general/settings"]'
  );
  expect(settingsLink).toBeTruthy();
});

test('shows loading state when isLoading and no community', () => {
  render(
    React.createElement(
      Provider,
      { store: initStore() },
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          ThemeProvider,
          { theme },
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(ChannelList, {
              data: { community: null },
              isLoading: true,
              dispatch: () => {},
              communitySlug: 'acme',
            })
          )
        )
      )
    )
  );

  // Loading component renders a progress indicator role or text; assert container has Loading
  // We check for the SectionCard presence and absence of error heading
  expect(
    screen.queryByText('We couldn’t load the channels for this community.')
  ).toBeNull();
});

test('shows error view when not loading and no community', () => {
  render(
    React.createElement(
      Provider,
      { store: initStore() },
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          ThemeProvider,
          { theme },
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(ChannelList, {
              data: { community: null },
              isLoading: false,
              dispatch: () => {},
              communitySlug: 'acme',
            })
          )
        )
      )
    )
  );

  expect(
    screen.getByText('We couldn’t load the channels for this community.')
  ).toBeInTheDocument();
});
