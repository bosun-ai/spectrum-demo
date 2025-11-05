import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CommunityList } from '../src/views/user/components/communityList';

// Helper: build props shape expected by CommunityList
const buildProps = ({ loading = false, edges = [] } = {}) => ({
  data: {
    loading,
    user: {
      communityConnection: {
        edges,
      },
    },
  },
  currentUser: {},
  user: {},
});

describe('CommunityList regression', () => {
  it('renders loading state when data.loading', () => {
    render(<CommunityList {...buildProps({ loading: true })} />);
    // Loading component should be present
    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it('renders explore button when no communities', () => {
    render(<CommunityList {...buildProps({ edges: [] })} />);
    const explore = screen.getByRole('link', { name: /explore communities/i });
    expect(explore).toHaveAttribute('href', '/explore');
  });

  it('renders list items when communities exist', () => {
    const edge = node => ({ node });
    const communities = [
      { id: 'c1', name: 'Alpha', profilePhoto: 'alpha.png' },
      { id: 'c2', name: 'Beta', profilePhoto: 'beta.png' },
    ];
    render(
      <CommunityList
        {...buildProps({ edges: communities.map(c => edge(c)) })}
      />
    );

    // CommunityListItem renders names; assert they appear
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
