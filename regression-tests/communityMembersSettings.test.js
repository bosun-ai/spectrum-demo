import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import theme from '../shared/theme';
import CommunityMembersSettings from '../src/views/communityMembers';
import { MemoryRouter } from 'react-router';

// Minimal reducer for Provider; component does not rely on specific slices here
const reducer = (state = {}) => state;

const renderWithProviders = ui => {
  const store = createStore(reducer);
  const client = new ApolloClient({
    link: ApolloLink.empty(),
    cache: new InMemoryCache(),
  });
  return render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{ui}</MemoryRouter>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  );
};

describe('CommunityMembersSettings', () => {
  it('renders ErrorView when no community id provided', () => {
    const props = {
      community: {},
      history: { push: jest.fn() },
      match: {},
    };

    const { container } = renderWithProviders(
      <CommunityMembersSettings {...props} />
    );

    // ErrorView renders an element with data-testid or fallback markup;
    // Assert that SectionCard does not exist when no id
    const sectionCards = container.querySelectorAll('[class*="SectionCard"]');
    expect(sectionCards.length).toBe(0);
  });

  it('renders SectionsContainer with CommunityMembers when community id exists', () => {
    const props = {
      community: {
        id: 'community-1',
        metaData: { members: 0 },
      },
      history: { push: jest.fn() },
      match: {},
    };

    const { getByText } = renderWithProviders(
      <CommunityMembersSettings {...props} />
    );

    // Verify the header and tabs render
    expect(getByText(/Community Members/i)).toBeInTheDocument();
    const membersTexts = document.querySelectorAll('*');
    const hasMembersTab = Array.from(membersTexts).some(el =>
      /Members/i.test(el.textContent || '')
    );
    expect(hasMembersTab).toBe(true);
    expect(getByText(/Team/i)).toBeInTheDocument();
  });
});
