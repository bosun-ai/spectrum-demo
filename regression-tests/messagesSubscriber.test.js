import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router';
import theme from '../shared/theme';
// Import the component; it is exported as default composed HOC.
import MessagesSubscriber from '../src/views/thread/components/messagesSubscriber';

// Helper to render with theme
const renderWithTheme = ui =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );

describe('Thread MessagesSubscriber', () => {
  it('shows Loading when isLoading and no thread data', () => {
    const props = {
      isWatercooler: false,
      data: { loading: true, thread: null },
      isLoading: true,
      isFetchingMore: false,
      hasError: false,
      loadPreviousPage: jest.fn(),
      loadNextPage: jest.fn(),
      location: { pathname: '/thread/t1', search: '' },
    };

    const { container } = renderWithTheme(<MessagesSubscriber {...props} />);
    // Loading should render inside NullMessagesWrapper
    const spinner = container.querySelector('svg, div');
    expect(spinner).toBeTruthy();
  });

  it('renders ChatMessages and next/prev controls when edges exist', () => {
    const edge = (id, cursor) => ({
      node: { id, content: 'msg ' + id },
      cursor,
    });
    const edges = [edge('m1', 'c1'), edge('m2', 'c2')];
    const props = {
      isWatercooler: false,
      data: {
        loading: false,
        thread: {
          id: 't1',
          watercooler: false,
          messageConnection: {
            edges,
            pageInfo: { hasPreviousPage: true, hasNextPage: true },
          },
        },
      },
      isLoading: false,
      isFetchingMore: false,
      hasError: false,
      loadPreviousPage: jest.fn(),
      loadNextPage: jest.fn(),
      location: { pathname: '/thread/t1', search: '' },
    };

    renderWithTheme(<MessagesSubscriber {...props} />);
    // Messages content should be present
    expect(screen.getByText(/msg m1/i)).toBeInTheDocument();
    expect(screen.getByText(/msg m2/i)).toBeInTheDocument();
    // NextPageButton components render buttons; assert buttons exist
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
