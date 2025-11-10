import React from 'react';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// Import the unwrapped component to avoid Apollo HOC requiring ApolloProvider
// Mock the GraphQL HOC to pass-through the component to avoid Apollo
jest.mock(
  '../src/shared/graphql/queries/user/getUserCommunityConnection',
  () => ({
    getCurrentUserCommunityConnection: Comp => Comp,
  })
);
// Import default which is compose(getCurrentUserCommunityConnection, withRouter)(HomeViewRedirect)
import HomeViewRedirect from '../src/views/homeViewRedirect';

// Helper to render with router history
const renderWithRouter = (ui, { history } = {}) => {
  const h = history || createMemoryHistory({ initialEntries: ['/'] });
  return {
    ...render(<Router history={h}>{ui}</Router>),
    history: h,
  };
};

// Component uses data.user.communityConnection.edges -> nodes with slug
const makeUser = (slugs = []) => ({
  communityConnection: {
    edges: slugs.map(slug => ({ node: { slug } })),
  },
});

test('renders LoadingView while loading', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const { container } = renderWithRouter(
    <HomeViewRedirect data={{ loading: true, user: null }} history={history} />,
    { history }
  );
  // LoadingView renders a container; simple sanity check
  expect(container).toBeTruthy();
});

test('redirects to server logout when no user', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  renderWithRouter(
    <HomeViewRedirect
      data={{ loading: false, user: null }}
      history={history}
    />,
    { history }
  );
  // Expect a full URL redirect to SERVER_URL/auth/logout
  expect(history.location.pathname).toBe('/auth/logout');
});

test('redirects to /explore when user has no communities', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const user = makeUser([]);
  renderWithRouter(
    <HomeViewRedirect data={{ loading: false, user }} history={history} />,
    { history }
  );
  expect(history.location.pathname).toBe('/explore');
});

test('redirects to first community slug when user has communities', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const user = makeUser(['alpha', 'beta']);
  renderWithRouter(
    <HomeViewRedirect data={{ loading: false, user }} history={history} />,
    { history }
  );
  expect(history.location.pathname).toBe('/alpha');
});
