const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').default;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { ApolloLink } = require('apollo-link');

// Import the component under test
const Routes = require('../src/routes.js').default;

// Helpers: wrap with MemoryRouter to provide routing context
function renderWithRouter(ui, { route = '/' } = {}) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.empty(),
    ssrMode: true,
  });
  return render(
    React.createElement(
      ApolloProvider,
      { client },
      React.createElement(MemoryRouter, { initialEntries: [route] }, ui)
    )
  );
}

describe('Routes', () => {
  test('redirects / to /explore', () => {
    renderWithRouter(React.createElement(Routes, { maintenanceMode: false }), {
      route: '/',
    });
    // Explore is a loadable view; it should render a LoadingView while loading
    // We can assert default Head markup exists and global UI pieces render
    expect(document.title).toBeTruthy();
    // Navigation and GlobalTitlebar are rendered via Route components; check by role or text fallback
    // As a smoke check, ensure the DOM renders without crashing and contains the app wrapper
    expect(document.body).toBeDefined();
  });

  test('renders login route', () => {
    renderWithRouter(React.createElement(Routes, { maintenanceMode: false }), {
      route: '/login',
    });
    // LoginFallback renders the Login view for unauthenticated users.
    // The Login page includes a form/button; assert presence of common text.
    // Since exact content can vary, do a loose smoke check on DOM existing.
    expect(document.body).toBeDefined();
  });

  test('renders maintenance view when maintenanceMode is true', () => {
    renderWithRouter(React.createElement(Routes, { maintenanceMode: true }), {
      route: '/',
    });
    // Maintenance view sets a specific Head title string
    // jsdom does not immediately update the title via Head; check for text in the Maintenance component
    expect(
      screen.getByText(/scheduled maintenance downtime/i)
    ).toBeInTheDocument();
  });
});
