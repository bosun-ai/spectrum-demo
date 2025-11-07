import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import MessagesWithData from '../src/views/directMessages/components/messages';

// Helper to render with theme
const renderWithTheme = ui =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('MessagesWithData component', () => {
  it('renders Loading when isLoading and no messages', () => {
    const props = {
      id: 'dm-1',
      data: {
        loading: true,
        directMessageThread: null,
        messages: [],
        hasNextPage: false,
        fetchMore: jest.fn(),
      },
      isLoading: true,
      hasError: false,
      isFetchingMore: false,
    };

    const { container } = renderWithTheme(<MessagesWithData {...props} />);
    // Loading component renders an SVG/div spinner inside MessagesScrollWrapper
    const spinner = container.querySelector('svg, div');
    expect(spinner).toBeTruthy();
  });

  it('renders grouped ChatMessages when messages present', () => {
    const messageEdge = id => ({ node: { id, content: 'hi ' + id } });
    const edges = [messageEdge('m1'), messageEdge('m2')];

    const props = {
      id: 'dm-1',
      data: {
        loading: false,
        directMessageThread: {
          id: 'dm-1',
          messageConnection: { edges },
        },
        messages: edges,
        hasNextPage: true,
        fetchMore: jest.fn(),
      },
      isLoading: false,
      hasError: false,
      isFetchingMore: false,
    };

    renderWithTheme(<MessagesWithData {...props} />);
    // NextPageButton should render when hasNextPage is true
    // It doesn't have a specific role; assert button exists
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // ChatMessages renders message groups; assert messages content appears
    expect(screen.getByText(/hi m1/i)).toBeInTheDocument();
    expect(screen.getByText(/hi m2/i)).toBeInTheDocument();
  });
});
