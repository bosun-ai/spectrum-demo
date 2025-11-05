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
        <MemoryRouter>{ui}</MemoryRouter>
      </ApolloProvider>
    </Provider>
  );

describe('CommunityMembers component regression', () => {
  it('renders header and members filter active by default', () => {
    renderWithProviders(<CommunityMembers {...baseProps} />);
    // Heading shows members count
    expect(screen.getByText(/Community Members · 3/i)).toBeInTheDocument();

    // Members filter should be active initially
    const membersFilter = screen.getByText(/members/i);
    expect(membersFilter).toBeInTheDocument();
    expect(membersFilter).toHaveAttribute('active', 'true');

    // Team filter exists and is not active initially
    const teamFilter = screen.getByText(/team/i);
    expect(teamFilter).toBeInTheDocument();
    expect(teamFilter).toHaveAttribute('active', 'false');
  });

  it('switches filters between Members and Team on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommunityMembers {...baseProps} />);

    const membersFilter = screen.getByText(/members/i);
    const teamFilter = screen.getByText(/team/i);

    // Initial state: members active
    expect(membersFilter).toHaveAttribute('active', 'true');
    expect(teamFilter).toHaveAttribute('active', 'false');

    // Click team -> team active
    await user.click(teamFilter);
    expect(teamFilter).toHaveAttribute('active', 'true');
    expect(membersFilter).toHaveAttribute('active', 'false');

    // Click members -> members active again
    await user.click(membersFilter);
    expect(membersFilter).toHaveAttribute('active', 'true');
    expect(teamFilter).toHaveAttribute('active', 'false');
  });
});
