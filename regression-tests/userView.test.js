import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';

// Import the unconnected, composed default export
import UserView from '../src/views/user/index';

// Helper to render with minimal props and router context
const setup = ({
  user = {
    id: 'u1',
    name: 'Ada Lovelace',
    username: 'ada',
    description: 'First programmer',
    profilePhoto: 'https://example.com/ada.jpg',
  },
  search = '',
} = {}) => {
  const history = createMemoryHistory({
    initialEntries: [`/user/ada${search}`],
  });

  const props = {
    match: { params: { username: 'ada' } },
    currentUser: { id: 'current' },
    data: { user },
    isLoading: false,
    queryVarIsChanging: false,
    dispatch: jest.fn(),
    history,
    location: history.location,
  };

  const store = createStore((state = {}) => state);
  // Minimal Apollo client to satisfy react-apollo context in tests
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.empty(),
  });

  const ui = (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <UserView {...props} />
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );

  return { ui, props, history };
};

describe('UserView regression', () => {
  it('renders user view with default posts tab when no tab in search', async () => {
    const { ui, history } = setup();
    render(ui);

    // Root element present
    expect(screen.getByTestId('user-view')).toBeInTheDocument();

    // Tabs are rendered and "Posts" is active by default
    const postsTab = screen.getByTestId('user-posts-tab');
    const activityTab = screen.getByTestId('user-activity-tab');
    expect(postsTab).toBeInTheDocument();
    expect(activityTab).toBeInTheDocument();

    // Default tab selection occurs by updating history search to ?tab=posts
    expect(history.location.search).toMatch(/tab=posts/);
  });

  it('switches tabs via clicks and updates query string', async () => {
    // v12 user-event exposes fire events directly
    const { ui, history } = setup({ search: '?tab=posts' });
    render(ui);

    const activityTab = screen.getByTestId('user-activity-tab');
    userEvent.click(activityTab);
    expect(history.location.search).toMatch(/tab=activity/);

    const infoTab = screen.getByTestId('user-info-tab');
    userEvent.click(infoTab);
    expect(history.location.search).toMatch(/tab=info/);
  });

  it('shows error view when no user and not loading', async () => {
    const { history } = setup();
    const props = {
      match: { params: { username: 'missing' } },
      currentUser: { id: 'current' },
      data: { user: null },
      isLoading: false,
      queryVarIsChanging: false,
      dispatch: jest.fn(),
      history,
      location: history.location,
    };

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.empty(),
    });
    const store = createStore((state = {}) => state);
    render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <Router history={history}>
              <UserView {...props} />
            </Router>
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    );

    // ErrorView renders a heading explaining missing user
    expect(
      screen.getByText(/couldn’t find a user with this username/i)
    ).toBeInTheDocument();
  });
});
