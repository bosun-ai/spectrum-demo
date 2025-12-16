const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the connected component; we will stub required props
const BanUserModal =
  require('src/components/modals/BanUserModal').default ||
  require('src/components/modals/BanUserModal');

function renderBanUserModal(overrides = {}) {
  const defaultProps = {
    isOpen: true,
    user: { id: 'u1', name: 'Ada Lovelace', username: 'ada' },
    currentUser: { id: 'admin' },
    dispatch: jest.fn(),
    banUser: jest.fn(() => Promise.resolve()),
  };
  const props = Object.assign({}, defaultProps, overrides);
  return render(React.createElement(BanUserModal, props));
}

test('renders with user data and validates reason', () => {
  renderBanUserModal();

  // Modal title and content label include the user name
  expect(screen.getByText('Ban Ada Lovelace (@ada)')).toBeInTheDocument();

  // Ban button should be disabled until a reason is entered
  const banButton = screen.getByText(/Ban User|Banning.../);
  expect(banButton).toBeDisabled();

  // Enter a reason to enable the button
  const textarea = screen.getByPlaceholderText(
    'Add a reason for banning this user...'
  );
  fireEvent.change(textarea, { target: { value: 'Violation of guidelines' } });
  expect(banButton).not.toBeDisabled();
});

test('submits ban with reason, closes, and toasts on success', async () => {
  const dispatch = jest.fn();
  const banUser = jest.fn(() => Promise.resolve());
  renderBanUserModal({ dispatch, banUser });

  // Fill in reason
  fireEvent.change(
    screen.getByPlaceholderText('Add a reason for banning this user...'),
    {
      target: { value: 'Repeated spam' },
    }
  );

  // Click ban
  fireEvent.click(screen.getByText('Ban User'));

  // Wait for async mutation to resolve
  await Promise.resolve();

  // Expect banUser called with correct input
  expect(banUser).toHaveBeenCalledTimes(1);
  expect(banUser).toHaveBeenCalledWith({
    userId: 'u1',
    reason: 'Repeated spam',
  });

  // Expect a success toast dispatched
  expect(dispatch).toHaveBeenCalled();
});
