const {
  deleteMessageWithToast,
} = require('../src/components/modals/DeleteDoubleCheckModal/index.js');

// Helper to extract dispatched actions from thunk-like toast dispatcher
function createDispatchCollector() {
  const actions = [];
  const dispatch = action => {
    // If addToastWithTimeout is called, it returns a function; call it with dispatch
    if (typeof action === 'function') {
      action(inner => actions.push(inner));
    } else {
      actions.push(action);
    }
  };
  return { actions, dispatch };
}

test('deleteMessageWithToast dispatches neutral toast on success', async () => {
  const { actions, dispatch } = createDispatchCollector();
  const mockDeleteMessage = jest.fn().mockResolvedValue({
    data: { deleteMessage: true },
  });

  await deleteMessageWithToast(dispatch, mockDeleteMessage, 'message-123');

  // Expect an ADD_TOAST action with kind 'neutral' and message 'Message deleted.'
  const addToastAction = actions.find(a => a && a.type === 'ADD_TOAST');
  expect(addToastAction).toBeTruthy();
  expect(addToastAction.payload.kind).toBe('neutral');
  expect(addToastAction.payload.message).toBe('Message deleted.');
  expect(mockDeleteMessage).toHaveBeenCalledWith('message-123');
});

test('deleteMessageWithToast dispatches error toast on failure with error message', async () => {
  const { actions, dispatch } = createDispatchCollector();
  const mockError = new Error('Network broken');
  const mockDeleteMessage = jest.fn().mockRejectedValue(mockError);

  await deleteMessageWithToast(dispatch, mockDeleteMessage, 'message-456');

  const addToastAction = actions.find(a => a && a.type === 'ADD_TOAST');
  expect(addToastAction).toBeTruthy();
  expect(addToastAction.payload.kind).toBe('error');
  expect(addToastAction.payload.message).toContain(
    "Sorry, we weren't able to delete this message."
  );
  expect(addToastAction.payload.message).toContain('Network broken');
  expect(mockDeleteMessage).toHaveBeenCalledWith('message-456');
});
