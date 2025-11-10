import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListCardItemDirectMessageThread from '../src/views/directMessages/components/messageThreadListItem';

// Mock styled-components wrappers to simple elements to avoid style dependencies
jest.mock('../src/views/directMessages/components/style', () => {
  const React = require('react');
  const Link = ({ to, children }) => <a href={to}>{children}</a>;
  const Div = ({ children }) => <div>{children}</div>;
  const P = ({ children }) => <p>{children}</p>;
  return {
    Wrapper: ({ children }) => <Div>{children}</Div>,
    WrapperLink: Link,
    Row: Div,
    Meta: ({ children }) => <P>{children}</P>,
    MessageGroupTextContainer: Div,
    MessageGroupByline: Div,
    Usernames: Div,
    Timestamp: ({ children }) => <span>{children}</span>,
  };
});

// Mock avatar rendering to a predictable output
jest.mock('../src/views/directMessages/components/avatars', () => ({
  renderAvatars: users => (
    <div data-testid="avatars">{users.map(u => u.name).join(', ')}</div>
  ),
}));

// Build a minimal direct message thread
const thread = {
  id: 't1',
  snippet: 'Last message preview',
  threadLastActive: new Date(Date.now() - 60 * 1000).toISOString(), // 1 minute ago
  participants: [
    { userId: 'me', id: 'me', name: 'Me' },
    { userId: 'u1', id: 'u1', name: 'Alice' },
    { userId: 'u2', id: 'u2', name: 'Bob' },
  ],
};

const currentUser = { id: 'me' };

const renderWithRouter = ui =>
  render(<MemoryRouter initialEntries={['/']}>{ui}</MemoryRouter>);

test('renders participants, timestamp, snippet and link', () => {
  renderWithRouter(
    <ListCardItemDirectMessageThread
      thread={thread}
      currentUser={currentUser}
      active={false}
    />
  );

  // Participants string should exclude current user and join with 'and'
  expect(screen.getByText(/Alice and Bob/)).toBeInTheDocument();

  // Snippet rendered
  expect(screen.getByText('Last message preview')).toBeInTheDocument();

  // Link points to the thread route
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/messages/t1');

  // Avatars rendered for non-current users
  expect(screen.getByTestId('avatars')).toHaveTextContent('Alice, Bob');
});
