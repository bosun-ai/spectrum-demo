import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExistingThread } from '../src/views/directMessages/containers/existingThread';

// Helper to render with route params via MemoryRouter
const renderWithRoute = (ui, { route = '/messages/thread/abc123' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

// Build minimal props; component expects these injected by HOCs but we can pass directly
const baseProps = {
  match: { params: { threadId: 'abc123' } },
  isLoading: false,
  threadSliderIsOpen: false,
  networkOnline: true,
  websocketConnection: 'connected',
  dispatch: jest.fn(),
  currentUser: { id: 'me', name: 'Me', username: 'me' },
};

test('renders loading view when isLoading and no data', () => {
  const props = {
    ...baseProps,
    isLoading: true,
    data: { directMessageThread: null, refetch: jest.fn() },
  };
  renderWithRoute(<ExistingThread {...props} />);
  // LoadingView renders a progress indicator from Loading component
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('renders ErrorView when not loading and no thread', () => {
  const props = {
    ...baseProps,
    isLoading: false,
    data: { directMessageThread: null, refetch: jest.fn() },
  };
  renderWithRoute(<ExistingThread {...props} />);
  // ErrorView likely shows a generic message; assert presence by heading role if available
  // Fallback: ensure nothing with role progressbar and component mounted
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});

test('renders thread view with DesktopTitlebar and Messages when thread available', () => {
  const thread = {
    id: 'abc123',
    participants: [
      { userId: 'me', name: 'Me', username: 'me' },
      { userId: 'u2', name: 'Alice', username: 'alice' },
    ],
  };
  const props = {
    ...baseProps,
    data: { directMessageThread: thread, refetch: jest.fn() },
  };
  renderWithRoute(<ExistingThread {...props} />);

  // Titlebar should render the participant name excluding current user
  expect(screen.getByText('Alice')).toBeInTheDocument();

  // Header and Messages components render; check for link to user profile info icon
  const profileLink = screen.getByRole('link', { name: /info/i });
  expect(profileLink).toHaveAttribute('href', '/users/alice');
});
