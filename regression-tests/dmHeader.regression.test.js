import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../src/views/directMessages/components/header';

// Mock Avatar to avoid Apollo dependency in tests
jest.mock('../src/components/avatar', () => ({
  UserAvatar: ({ children }) => (
    <span data-testid="mock-avatar">{children}</span>
  ),
}));

// Helpers to build thread + user objects
const makeUser = (overrides = {}) => ({
  id:
    'u-' +
    Math.random()
      .toString(36)
      .slice(2),
  userId:
    overrides.userId ||
    overrides.id ||
    'uid-' +
      Math.random()
        .toString(36)
        .slice(2),
  name: overrides.name || 'Test User',
  username: overrides.username || 'testuser',
  ...overrides,
});

const makeThread = participants => ({ participants });

test('Header shows Head meta only in 1:1 DM', () => {
  const currentUser = { id: 'me' };
  const other = makeUser({
    id: 'other',
    userId: 'other',
    name: 'Alice',
    username: 'alice',
  });
  const thread = makeThread([
    makeUser({ id: 'me', userId: 'me', name: 'Me', username: 'me' }),
    other,
  ]);

  const { container } = render(
    <HelmetProvider>
      <Header thread={thread} currentUser={currentUser} />
    </HelmetProvider>
  );

  // In 1:1, StyledHeader should not render; component returns only <Head />
  expect(container.querySelector('[data-cy="dm-header"]')).toBeNull();
});

test('Header renders avatars and names for group DM', () => {
  const currentUser = { id: 'me' };
  const alice = makeUser({
    id: 'alice',
    userId: 'alice',
    name: 'Alice',
    username: 'alice',
  });
  const bob = makeUser({
    id: 'bob',
    userId: 'bob',
    name: 'Bob',
    username: 'bob',
  });
  const me = makeUser({ id: 'me', userId: 'me', name: 'Me', username: 'me' });
  const thread = makeThread([me, alice, bob]);

  render(
    <HelmetProvider>
      <Header thread={thread} currentUser={currentUser} />
    </HelmetProvider>
  );

  // StyledHeader is present
  const header = document.querySelector('[data-cy="dm-header"]');
  expect(header).toBeInTheDocument();

  // Names should combine participants excluding current user
  expect(screen.getByText('Alice, Bob')).toBeInTheDocument();

  // Username is only shown for 1:1; for group it's empty string
  // So ensure no @alice or @bob appears
  expect(screen.queryByText(/@alice/i)).toBeNull();
  expect(screen.queryByText(/@bob/i)).toBeNull();
});
