import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunityMembersSettings from '../src/views/communityMembers';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// Minimal wrapper props to render the settings view
const baseProps = {
  currentUser: { id: 'u1' },
  dispatch: jest.fn(),
  match: {},
  history: {},
};

// Minimal Apollo client to satisfy context; network isn't exercised
const client = new ApolloClient({
  link: createHttpLink({ uri: '/graphql', fetch: () => Promise.resolve() }),
  cache: new InMemoryCache(),
});

// Minimal Redux store to satisfy react-redux connect HOC
const store = createStore((state = {}) => state);

describe('CommunityMembersSettings regression', () => {
  it('renders ErrorView when no community provided', () => {
    render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <CommunityMembersSettings {...baseProps} community={null} />
        </ApolloProvider>
      </Provider>
    );
    // ErrorView renders a fallback role heading text; assert presence by generic text
    // We expect no "Community Members" heading when community is missing
    expect(screen.queryByText(/community members/i)).not.toBeInTheDocument();
  });

  it('renders members view when community id exists', () => {
    const community = {
      id: 'c1',
      metaData: { members: 5 },
    };
    render(
      <Provider store={store}>
        <ApolloProvider client={client}>
          <CommunityMembersSettings {...baseProps} community={community} />
        </ApolloProvider>
      </Provider>
    );
    // Heading comes from inner CommunityMembers component
    expect(screen.getByText(/community members · 5/i)).toBeInTheDocument();
    // Filter tabs should be visible
    expect(screen.getByText(/members/i)).toBeInTheDocument();
    expect(screen.getByText(/team/i)).toBeInTheDocument();
  });
});
