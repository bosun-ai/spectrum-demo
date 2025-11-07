import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
// Import the unconnected component via default export path
import CommunityList from '../src/views/user/components/communityList';

// Helper to render with theme
const renderWithTheme = ui =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const baseProps = {
  // data prop is injected by getUserCommunityConnection HOC; we simulate it
  data: { loading: false, user: { communityConnection: { edges: [] } } },
  currentUser: {},
  user: {},
};

describe('CommunityList', () => {
  it('renders Loading when data.loading is true', () => {
    renderWithTheme(
      <CommunityList
        {...baseProps}
        data={{ ...baseProps.data, loading: true }}
      />
    );
    // Loading renders padding style; assert element exists by inline style text
    // Safer: check button not present while loading
    expect(screen.queryByText(/Explore communities/i)).toBeNull();
  });

  it('renders explore button when no communities', () => {
    renderWithTheme(<CommunityList {...baseProps} />);
    expect(screen.getByText(/Explore communities/i)).toBeInTheDocument();
  });

  it('renders a list of communities when edges present', () => {
    const edges = [
      { node: { id: 'c1', name: 'Community One', profilePhoto: 'photo1.png' } },
      { node: { id: 'c2', name: 'Community Two', profilePhoto: 'photo2.png' } },
    ];
    const props = {
      ...baseProps,
      data: { loading: false, user: { communityConnection: { edges } } },
    };

    renderWithTheme(<CommunityList {...props} />);

    // CommunityListItem renders the community name; assert both are present
    expect(screen.getByText('Community One')).toBeInTheDocument();
    expect(screen.getByText('Community Two')).toBeInTheDocument();
    // And the explore button should not be shown
    expect(screen.queryByText(/Explore communities/i)).toBeNull();
  });
});
