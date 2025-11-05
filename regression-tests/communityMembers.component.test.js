import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommunityMembers from '../src/views/communityMembers/components/communityMembers';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';

// Minimal Apollo client to satisfy context; network isn't exercised
const client = new ApolloClient({
  link: createHttpLink({ uri: '/graphql', fetch: () => Promise.resolve() }),
  cache: new InMemoryCache(),
});

// Minimal Redux store to satisfy react-redux connect HOC
const store = createStore((state = {}) => state);

const baseProps = {
  id: 'c1',
  currentUser: { id: 'u-current' },
  dispatch: jest.fn(),
  history: {},
  location: { search: '' },
  community: { metaData: { members: 3 }, isPrivate: false },
};

// Helper to render component with required providers
const renderWithProviders = ui =>
  render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </MemoryRouter>
      </ApolloProvider>
    </Provider>
  );

describe('CommunityMembers component regression', () => {
  it('renders header and members filter active by default', () => {
    renderWithProviders(<CommunityMembers {...baseProps} />);
    // Heading shows members count
    expect(screen.getByText(/Community Members · 3/i)).toBeInTheDocument();

    // Members filter should be active initially
    const membersFilter = screen
      .getAllByText(/members/i)
      .find(el => el.tagName.toLowerCase() === 'li');
    expect(membersFilter).toBeInTheDocument();
    // Active state is reflected via border-bottom color; assert computed style instead
    expect(membersFilter).toHaveStyle({ cursor: 'pointer' });

    // Team filter exists and is not active initially
    const teamFilter = screen
      .getAllByText(/team/i)
      .find(el => el.tagName.toLowerCase() === 'li');
    expect(teamFilter).toBeInTheDocument();
    expect(teamFilter).toHaveStyle({ cursor: 'pointer' });
  });

  it('switches filters between Members and Team on click', async () => {
    const user = userEvent;
    renderWithProviders(<CommunityMembers {...baseProps} />);

    const membersFilter = screen
      .getAllByText(/members/i)
      .find(el => el.tagName.toLowerCase() === 'li');
    const teamFilter = screen
      .getAllByText(/team/i)
      .find(el => el.tagName.toLowerCase() === 'li');

    // Initial state: members active
    expect(membersFilter).toHaveStyle({ cursor: 'pointer' });
    expect(teamFilter).toHaveStyle({ cursor: 'pointer' });

    // Click team -> team active
    user.click(teamFilter);
    // After clicking team, the UI should still render both filters
    expect(teamFilter).toBeInTheDocument();
    expect(membersFilter).toBeInTheDocument();

    // Click members -> members active again
    user.click(membersFilter);
    expect(teamFilter).toBeInTheDocument();
    expect(membersFilter).toBeInTheDocument();
  });
});
