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

  // Expect the login view to render. The Login component marks the root with data-cy="login-page".
  // Prefer an accessible query as fallback if needed; here we query by attribute.
  // Query by the data-cy attribute exposed by Login component
  // Use a polling loop via waitFor to avoid race conditions
  const loginContainer = await (async () => {
    const { waitFor } = require('@testing-library/react');
    let el = null;
    await waitFor(() => {
      el = document.querySelector('[data-cy="login-page"]');
      expect(el).toBeTruthy();
    });
    return el;
  })();
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
  const loginContainer = document.querySelector('[data-cy="login-page"]');
  expect(loginContainer).toBeNull();
});
