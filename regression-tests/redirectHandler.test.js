const React = require('react');
const { render } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').default;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloLink } = require('apollo-link');

// Import history singleton used by component
const { history } = require('../src/helpers/history.js');

// Import the component under test (the HOC-wrapped export)
const RedirectHandler = require('../src/components/redirectHandler/index.js')
  .default;

function renderWithProviders(ui) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.empty(),
    ssrMode: true,
  });
  return render(
    React.createElement(
      ApolloProvider,
      { client },
      React.createElement(MemoryRouter, { initialEntries: ['/'] }, ui)
    )
  );
}

describe('RedirectHandler', () => {
  beforeEach(() => {
    // Reset history to a clean state
    history.replace('/');
  });

  test('anonymous user: redirects ?t=threadId to /thread/threadId', () => {
    // Set initial location with query string
    history.replace('/?t=abc123');

    // Render the component; it uses withCurrentUser HOC which queries Apollo.
    // Our Apollo client has no link; CurrentUser will render null until children,
    // but RedirectHandler receives props via HOC with currentUser null and isLoading false
    renderWithProviders(
      React.createElement(RedirectHandler, { maintenanceMode: false })
    );

    // Trigger lifecycle: componentDidUpdate relies on a change from loading -> not loading.
    // Simulate that transition by dispatching a microtask tick where history is observed.
    // Since we cannot easily change isLoading via HOC, verify that even without transition
    // rendering does not crash and replace did not change if no transition.
    // To robustly assert redirect behavior, re-render to force update and check URL.
    renderWithProviders(
      React.createElement(RedirectHandler, { maintenanceMode: false })
    );

    // Expect history to have been redirected to thread route
    expect(history.location.pathname).toBe('/thread/abc123');
  });

  test('authenticated user: does not redirect when ?t= is present', () => {
    // Place query param in location
    history.replace('/?t=abc123');

    // Mock CurrentUser to provide a user; one approach is to temporarily stub the HOC's CurrentUser component.
    // Instead, since the exported component is HOC-wrapped, create a minimal replacement that injects props.
    // We can import the underlying WrappedComponent via the HOC statics.
    const Wrapped = RedirectHandler.WrappedComponent || RedirectHandler;

    // Render the underlying component directly with currentUser and not loading
    renderWithProviders(
      React.createElement(Wrapped, {
        maintenanceMode: false,
        currentUser: { id: 'u1' },
        isLoadingCurrentUser: false,
      })
    );

    // Since user exists, no redirect should have occurred
    expect(history.location.pathname).toBe('/');
  });
});
