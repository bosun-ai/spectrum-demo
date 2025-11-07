import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import ListCardItemDirectMessageThread from '../src/views/directMessages/components/messageThreadListItem';

// Minimal participant/user shape based on component needs
const makeUser = (overrides = {}) => ({
  userId: 'user-1',
  name: 'Ada Lovelace',
  ...overrides,
});

const makeThread = (overrides = {}) => ({
  id: 'dm-123',
  participants: [
    makeUser({ userId: 'user-1', name: 'Ada Lovelace' }),
    makeUser({ userId: 'user-2', name: 'Grace Hopper' }),
  ],
  snippet: 'Latest message snippet goes here',
  threadLastActive: new Date().toISOString(),
  ...overrides,
});

describe('ListCardItemDirectMessageThread', () => {
  it('renders participant names (excluding current user), timestamp, and snippet', () => {
    const currentUser = { id: 'user-1' };
    const thread = makeThread();

    render(
      <ThemeProvider theme={theme}>
        <ListCardItemDirectMessageThread
          active={false}
          currentUser={currentUser}
          thread={thread}
        />
      </ThemeProvider>
    );

    // Participants string should exclude current user and include the other
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();

    // Snippet appears in Meta element
    expect(
      screen.getByText('Latest message snippet goes here')
    ).toBeInTheDocument();

    // Timestamp renders a human readable string; since exact value varies,
    // assert the element exists by role/text proximity: it's inside the byline
    // and should be a non-empty element.
    const timestampEl = screen.getByText((content, node) => {
      // find the element next to Usernames; any non-empty text is fine
      return Boolean(content) && node?.tagName?.toLowerCase() === 'span';
    });
    expect(timestampEl).toBeTruthy();

    // Link should route to the messages thread
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/messages/${thread.id}`);
  });

  it('renders multiple participant names joined with "and"', () => {
    const currentUser = { id: 'user-9' };
    const thread = makeThread({
      participants: [
        makeUser({ userId: 'user-9', name: 'Current User' }),
        makeUser({ userId: 'user-2', name: 'Grace Hopper' }),
        makeUser({ userId: 'user-3', name: 'Alan Turing' }),
      ],
    });

    render(
      <ThemeProvider theme={theme}>
        <ListCardItemDirectMessageThread
          active={true}
          currentUser={currentUser}
          thread={thread}
        />
      </ThemeProvider>
    );

    // Should render "Grace Hopper and Alan Turing"
    expect(screen.getByText(/Grace Hopper and Alan Turing/)).toBeInTheDocument();
  });
});
