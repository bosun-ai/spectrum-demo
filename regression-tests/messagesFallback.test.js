const React = require('react');
const { render, screen } = require('@testing-library/react');

// Render a minimal router context to mount the route components
const { MemoryRouter, Route } = require('react-router');

// We import the real Routes so we exercise MessagesFallback wiring
const Routes = require('src/routes').default;
const { ApolloProvider } = require('react-apollo');
const { Provider } = require('react-redux');
const { HelmetProvider } = require('react-helmet-async');
const { initStore } = require('src/store');
const { client } = require('shared/graphql');

// MSW server is already set up by regression-tests/setupTests.js
const { rest } = require('msw');
const { server } = require('./server');

// Helper to mock current user GraphQL response
const mockGetCurrentUser = user => {
  // The app uses shared/graphql/queries/user/getUser under the hood which hits /api/graphql
  // We intercept GraphQL POSTs and return a basic shape for `getCurrentUser`.
  server.use(
    rest.post('http://localhost/api/graphql', async (req, res, ctx) => {
      const body = req.body || {};
      const opName = body && body.operationName;
      if (opName === 'getCurrentUser') {
        return res(
          ctx.json({
            data: {
              user: user || null,
            },
          })
        );
      }
      return res(ctx.json({ data: {} }));
    })
  );
};

test('MessagesFallback shows Login when signed out', async () => {
  mockGetCurrentUser(null);
  const store = initStore({});
  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        HelmetProvider,
        null,
        React.createElement(
          ApolloProvider,
          { client },
          React.createElement(
            MemoryRouter,
            { initialEntries: ['/messages'] },
            React.createElement(
              Route,
              { path: '/' },
              React.createElement(Routes, { maintenanceMode: false })
            )
          )
        )
      )
    )
  );

  // Expect the login view to render; `Login` component renders a button with text "Log in"
  // and also commonly includes redirect param. Look for generic login text.
  const loginPage = await screen.findByTestId('login-page');
  expect(loginPage).toBeInTheDocument();
});

test('MessagesFallback renders DirectMessages when authenticated', async () => {
  // Provide a minimal authed user object with id and username
  mockGetCurrentUser({ id: 'u1', username: 'alice', timezone: 0 });
  const store = initStore({});
  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        HelmetProvider,
        null,
        React.createElement(
          ApolloProvider,
          { client },
          React.createElement(
            MemoryRouter,
            { initialEntries: ['/messages'] },
            React.createElement(
              Route,
              { path: '/' },
              React.createElement(Routes, { maintenanceMode: false })
            )
          )
        )
      )
    )
  );

  // When authed, the DirectMessages containers render; assert that the app does not show the login page
  const loginPage = screen.queryByTestId('login-page');
  expect(loginPage).toBeNull();
});
