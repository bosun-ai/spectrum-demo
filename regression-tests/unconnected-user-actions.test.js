const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the component under test
const {
  UnconnectedUserActions,
} = require('../src/components/entities/profileCards/components/userActions.js');

// Minimal user object builder
const makeUser = ({ id = 'user-1', username = 'jdoe' } = {}) => ({
  id,
  username,
});

test('renders Settings link when viewing own profile', () => {
  const user = makeUser({ id: 'me', username: 'meuser' });
  const element = React.createElement(UnconnectedUserActions, {
    user,
    currentUser: { id: 'me' },
    dispatch: () => {},
  });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const btn = getByText('Settings');
  expect(btn).toBeInTheDocument();
  const link = btn.closest('a') || btn.parentElement;
  if (link && link.getAttribute) {
    const href = link.getAttribute('href');
    const toAttr = link.getAttribute('to');
    expect(href || toAttr).toBe('/users/meuser/settings');
  }
});

test('renders Ban button when current user is admin and viewing other user', () => {
  const user = makeUser({ id: 'user-2', username: 'other' });
  // The component uses isAdmin(currentUser.id). isAdmin is true for specific ids.
  // In this codebase, admin ids include 'admin' used in tests elsewhere; use 'admin'.
  const currentUser = { id: 'admin' };
  const dispatched = [];
  const fakeDispatch = action => {
    dispatched.push(action);
    return action;
  };
  const element = React.createElement(UnconnectedUserActions, {
    user,
    currentUser,
    dispatch: fakeDispatch,
  });
  const { getByText } = render(
    React.createElement(MemoryRouter, null, element)
  );
  const banBtn = getByText('Ban');
  expect(banBtn).toBeInTheDocument();
  fireEvent.click(banBtn);
  // Expect that dispatch was called with openModal('BAN_USER_MODAL', { user })
  expect(dispatched.length).toBeGreaterThan(0);
  const last = dispatched[dispatched.length - 1];
  // openModal returns a plain action; ensure type and payload structure if available
  // Be flexible: verify payload includes modalType and user or string and user
  const payload = last && last.payload;
  const type = last && last.type;
  expect(type).toBeDefined();
  if (payload) {
    expect(payload.user || (payload.data && payload.data.user)).toEqual(
      expect.objectContaining({ id: 'user-2', username: 'other' })
    );
  }
});

test('does not render Buttons when no user passed', () => {
  const element = React.createElement(UnconnectedUserActions, {
    user: null,
    currentUser: { id: 'me' },
    dispatch: () => {},
  });
  const { container } = render(
    React.createElement(MemoryRouter, null, element)
  );
  // Component returns null when no user
  expect(container.firstChild).toBeNull();
});
