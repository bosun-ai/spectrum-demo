const React = require('react');
const { MemoryRouter, Route } = require('react-router');
const { ApolloProvider } = require('react-apollo');
const ApolloClient = require('apollo-client').ApolloClient;
const { InMemoryCache } = require('apollo-cache-inmemory');
const { SchemaLink } = require('apollo-link-schema');
const schema = require('../shared/graphql/schema.json');
const { render, screen } = require('@testing-library/react');

// Render the real Routes component and navigate to /explore
describe('Explore Route', () => {
  test('renders Explore view at /explore', async () => {
    const Routes = require('../src/routes.js').default;

    const client = new ApolloClient({
      link: new SchemaLink({ schema }),
      cache: new InMemoryCache(),
    });

    render(
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          MemoryRouter,
          { initialEntries: ['/explore'] },
          React.createElement(Route, { path: '/', component: Routes })
        )
      )
    );

    // Explore view sets data-cy="explore-page" on ViewGrid
    const explore = await screen
      .findByTestId('explore-page', {}, { timeout: 5000 })
      .catch(() => null);
    const byDataCy =
      explore || document.querySelector('[data-cy="explore-page"]');
    expect(byDataCy).toBeTruthy();
  });
});
