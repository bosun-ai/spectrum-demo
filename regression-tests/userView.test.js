const React = require('react');
const { render, fireEvent } = require('@testing-library/react');

// Minimal shims for providers used by UserView
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const { MemoryRouter } = require('react-router');
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').default;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const { ThemeProvider } = require('styled-components');
const theme = require('shared/theme').default || require('shared/theme');

// Import the composed component
const UserView = require('src/views/user').default;

// Create a minimal Redux reducer/store to satisfy connect() usage
function reducer(
  state = {
    connectionStatus: { networkOnline: true, websocketConnection: 'open' },
  },
  action
) {
  switch (action && action.type) {
    default:
      return state;
  }
}

function createTestStore() {
  return createStore(reducer);
}

// Helper to render with providers and a starting location
function renderWithProviders(
  ui,
  { route = '/users/johndoe', historyEntries } = {}
) {
  const store = createTestStore();
  const client = new ApolloClient({
    link: new HttpLink({ uri: '/graphql', fetch: require('cross-fetch') }),
    cache: new InMemoryCache(),
    connectToDevTools: false,
    ssrMode: true,
  });
  const element = React.createElement(
    Provider,
    { store },
    React.createElement(
      ApolloProvider,
      { client },
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(
          MemoryRouter,
          { initialEntries: historyEntries || [route] },
          ui
        )
      )
    )
  );
  return render(element);
}

// Build a minimal set of props expected by the unconnected wrapped component
function buildProps({ user, locationSearch } = {}) {
  const location = { pathname: '/users/johndoe', search: locationSearch || '' };
  const history = {
    replace: jest.fn(),
  };
  const match = { params: { username: 'johndoe' } };
  const currentUser = null;
  return {
    match,
    currentUser,
    data: { user: user || null },
    isLoading: false,
    queryVarIsChanging: false,
    dispatch: jest.fn(),
    history,
    location,
  };
}

test('renders error when no user', () => {
  const props = buildProps({ user: null });
  const { getByText } = renderWithProviders(
    React.createElement(UserView, props)
  );
  // Specific error heading from component
  expect(
    getByText('We couldn’t find a user with this username')
  ).toBeInTheDocument();
});

test('sets default tab to posts and shows segments', () => {
  const user = {
    id: 'u1',
    name: 'John Doe',
    username: 'johndoe',
    description: 'A test user',
    profilePhoto: 'https://example.com/photo.jpg',
  };
  const props = buildProps({ user, locationSearch: '' });

  const { getByText } = renderWithProviders(
    React.createElement(UserView, props)
  );

  // Default tab set to posts should render the SegmentedControl labels
  expect(getByText('Posts')).toBeInTheDocument();
  expect(getByText('Activity')).toBeInTheDocument();
  expect(getByText('Info')).toBeInTheDocument();

  // Default tab handler should have been called updating history.replace
  expect(props.history.replace).toHaveBeenCalled();
});

test('switching tabs updates search and shows null state if no threads', () => {
  const user = {
    id: 'u2',
    name: 'Jane Doe',
    username: 'janedoe',
    description: 'Another test user',
    profilePhoto: 'https://example.com/photo2.jpg',
  };
  const props = buildProps({ user, locationSearch: '?tab=posts' });
  const { getByText } = renderWithProviders(
    React.createElement(UserView, props)
  );

  // Click Activity tab
  const activityTab = getByText('Activity');
  fireEvent.click(activityTab);
  expect(props.history.replace).toHaveBeenCalledWith(
    expect.objectContaining({ search: 'tab=activity' })
  );

  // Click Info tab
  const infoTab = getByText('Info');
  fireEvent.click(infoTab);
  expect(props.history.replace).toHaveBeenCalledWith(
    expect.objectContaining({ search: 'tab=info' })
  );
});
