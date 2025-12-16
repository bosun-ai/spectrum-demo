const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the unconnected component directly to control props
const {
  UnconnectedUserActions,
} = require('../src/components/entities/profileCards/components/userActions');

// Mock openModal action to a simple identifiable object
jest.mock('../src/actions/modals', () => ({
  openModal: (type, payload) => ({
    type: 'OPEN_MODAL',
    modalType: type,
    payload,
  }),
}));

// Mock admin helper to return true for a specific id and false otherwise
jest.mock('../src/helpers/is-admin', () => ({
  isAdmin: id => id === 'admin-user-id',
}));

describe('UnconnectedUserActions', () => {
  test('renders Settings link when viewing own profile', () => {
    const user = { id: 'u1', username: 'jane' };
    const currentUser = { id: 'u1' };
    const fakeDispatch = jest.fn();

    render(
      React.createElement(UnconnectedUserActions, {
        user,
        currentUser,
        dispatch: fakeDispatch,
      })
    );

    const settingsLink = screen.getByText('Settings');
    expect(settingsLink.tagName.toLowerCase()).toBe('a');
    expect(settingsLink).toHaveAttribute('href', '/users/jane/settings');
    // No ban button when same user
    expect(screen.queryByText('Ban')).toBeNull();
  });

  test('renders Ban button for admin viewing another user and dispatches modal', () => {
    const user = { id: 'u2', username: 'john' };
    const currentUser = { id: 'admin-user-id' }; // mocked isAdmin returns true
    const fakeDispatch = jest.fn();

    render(
      React.createElement(UnconnectedUserActions, {
        user,
        currentUser,
        dispatch: fakeDispatch,
      })
    );

    const banButton = screen.getByText('Ban');
    expect(banButton).toBeInTheDocument();

    fireEvent.click(banButton);
    expect(fakeDispatch).toHaveBeenCalledTimes(1);
    const dispatched = fakeDispatch.mock.calls[0][0];
    expect(dispatched).toMatchObject({
      type: 'OPEN_MODAL',
      modalType: 'BAN_USER_MODAL',
    });
    expect(dispatched.payload).toMatchObject({ user });
  });

  test('renders nothing if no user provided', () => {
    const { container } = render(
      React.createElement(UnconnectedUserActions, {
        user: null,
        currentUser: null,
        dispatch: jest.fn(),
      })
    );
    expect(container.firstChild).toBeNull();
  });
});
