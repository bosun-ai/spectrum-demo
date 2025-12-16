const React = require('react');
const { Provider } = require('react-redux');
const { render, screen, fireEvent } = require('@testing-library/react');

// Render the connected component with a real store, overriding props via modal state
const DeleteDoubleCheckModal =
  require('src/components/modals/DeleteDoubleCheckModal').default ||
  require('src/components/modals/DeleteDoubleCheckModal');
const { initStore } = require('src/store');

function renderModal({
  entity = 'message',
  id = 'm1',
  message = 'Are you sure you want to delete this?',
  buttonLabel = 'Delete',
  redirect,
  extraProps,
  dispatch = jest.fn(),
  deleteMessage = jest.fn(() =>
    Promise.resolve({ data: { deleteMessage: true } })
  ),
  deleteThread = jest.fn(() =>
    Promise.resolve({ data: { deleteThread: true } })
  ),
  deleteChannel = jest.fn(() =>
    Promise.resolve({ data: { deleteChannel: true } })
  ),
  deleteCommunity = jest.fn(() =>
    Promise.resolve({ data: { deleteCommunity: true } })
  ),
} = {}) {
  const store = initStore({
    modals: {
      isOpen: true,
      modalProps: { id, entity, redirect, message, buttonLabel, extraProps },
    },
  });
  // The connected component reads `dispatch` from props for close; stub via prop override by wrapping createElement
  return render(
    React.createElement(
      Provider,
      { store },
      React.createElement(DeleteDoubleCheckModal, {
        isOpen: true,
        dispatch,
        deleteMessage,
        deleteThread,
        deleteChannel,
        deleteCommunity,
        // history is injected via withRouter in component; provide minimal shape used (replace)
        history: { replace: jest.fn(), push: jest.fn() },
      })
    )
  );
}

test('renders message and custom button label', () => {
  renderModal({ message: 'Custom confirm', buttonLabel: 'Remove' });

  // Title is rendered by ModalContainer; content label controls aria; assert visible message and button
  expect(screen.getByText('Custom confirm')).toBeInTheDocument();
  expect(screen.getByText('Remove')).toBeInTheDocument();

  // Cancel button present
  expect(screen.getByText('Cancel')).toBeInTheDocument();
});

test('clicking delete for message triggers mutation, closes, and dispatches toast', async () => {
  const dispatch = jest.fn();
  const deleteMessage = jest.fn(() =>
    Promise.resolve({ data: { deleteMessage: true } })
  );
  renderModal({ entity: 'message', id: 'abc', dispatch, deleteMessage });

  // Click the delete button
  fireEvent.click(screen.getByText('Delete'));

  // Wait microtask queue to flush the promise chain
  await Promise.resolve();

  // Mutation called with id
  expect(deleteMessage).toHaveBeenCalledTimes(1);
  expect(deleteMessage).toHaveBeenCalledWith('abc');

  // A toast dispatch occurs; closeModal also dispatches, so we should see multiple dispatches
  expect(dispatch).toHaveBeenCalled();
});
