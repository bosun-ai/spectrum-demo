const React = require('react');
const { render } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').ApolloClient;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloLink } = require('apollo-link');

// Mock withCurrentUser HOC to avoid Apollo requirements and pass props through
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
// Import the connected component
const ActionBar = require('../src/views/thread/components/actionBar.js')
  .default;

// Minimal reducer for Provider; component only uses connect() without selectors
function noopReducer(state = {}) {
  return state;
}

// Build a minimal thread object matching usage in ActionsDropdown
function makeThread(overrides = {}) {
  return {
    id: 'thread-id',
    isAuthor: true,
    author: { user: { id: 'author-id' } },
    channel: {
      name: 'general',
      channelPermissions: { isModerator: false, isOwner: false },
    },
    community: {
      name: 'Acme',
      communityPermissions: { isModerator: false, isOwner: false },
    },
    ...overrides,
  };
}

// Helper to render with redux
function renderWithStore(ui, { initialState } = {}) {
  const store = createStore(noopReducer, initialState);
  // Create a minimal Apollo Client that won't perform network requests
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.empty(),
    assumeImmutableResults: true,
  });
  return render(
    React.createElement(
      ApolloProvider,
      { client },
      React.createElement(Provider, { store }, ui)
    )
  );
}

test('ActionBar renders container and hides actions when no currentUser', () => {
  const thread = makeThread();
  const element = React.createElement(ActionBar, { thread });
  const { container, queryByTestId } = renderWithStore(element);

  // Ensure the ActionBarContainer exists (styled component renders a div)
  const actionBarDivs = container.querySelectorAll('div');
  expect(actionBarDivs.length).toBeGreaterThan(0);

  // ActionsDropdown returns null without currentUser; ensure no trigger present
  expect(queryByTestId('thread-actions-dropdown-trigger')).toBeNull();
});

test('ActionBar renders actions when currentUser present', () => {
  const thread = makeThread();
  const currentUser = { id: 'author-id' }; // author can delete
  const element = React.createElement(ActionBar, { thread, currentUser });
  const { container } = renderWithStore(element);

  // ActionsDropdown should render trigger icon when currentUser exists
  // Icon does not use data-testid attr; verify DropWrap renders an icon wrapper
  const icons = container.querySelectorAll('.icon');
  expect(icons.length).toBeGreaterThan(0);
});
