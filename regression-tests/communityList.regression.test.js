import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
// Mock graphql HOC to avoid requiring ApolloProvider in regression
jest.mock('../shared/graphql/queries/user/getUserCommunityConnection', () => ({
  getUserCommunityConnection: Comp => Comp,
}));
// Mock react-redux connect to identity HOC
jest.mock('react-redux', () => ({ connect: () => Comp => Comp }));
import CommunityList from '../src/views/user/components/communityList';

// Minimal regression: renders loading, empty state, and list items
test('CommunityList shows loading, empty, then items', () => {
  // 1) Loading state
  const { rerender } = render(
    <MemoryRouter>
      <CommunityList data={{ loading: true }} />
    </MemoryRouter>
  );
  // Loading component renders a progress role via spinner SVG or text; assert by text fallback
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // 2) Empty state: no edges
  rerender(
    <MemoryRouter>
      <CommunityList
        data={{
          loading: false,
          user: { communityConnection: { edges: [] } },
        }}
      />
    </MemoryRouter>
  );
  // PrimaryOutlineButton should render link to explore communities
  const explore = screen.getByRole('link', { name: /explore communities/i });
  expect(explore).toBeInTheDocument();
  expect(explore).toHaveAttribute('href', '/explore');

  // 3) List of communities
  const dataWithCommunities = {
    loading: false,
    user: {
      communityConnection: {
        edges: [
          {
            node: { id: '1', slug: 'alpha', name: 'Alpha', profilePhoto: 'x' },
          },
          { node: { id: '2', slug: 'beta', name: 'Beta', profilePhoto: 'y' } },
        ],
      },
    },
  };
  rerender(
    <MemoryRouter>
      <CommunityList data={dataWithCommunities} />
    </MemoryRouter>
  );

  // CommunityListItem renders each community name as a label
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.getByText('Beta')).toBeInTheDocument();

  // Each item links to community slug
  const alphaLink = screen.getByRole('link', { name: /alpha/i });
  const betaLink = screen.getByRole('link', { name: /beta/i });
  expect(alphaLink).toHaveAttribute('href', '/alpha');
  expect(betaLink).toHaveAttribute('href', '/beta');
});
