import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// Import the connected Channel component, which is the default export
import Channel from 'src/views/channelSettings/components/editForm.js';

describe('ChannelWithData regression', () => {
  // Minimal root reducer for Redux store (no-op, just for dispatch)
  function reducer(state = {}) {
    return state;
  }
  function renderWithStore(ui, { store = createStore(reducer, {}) } = {}) {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  const fakeCommunity = {
    id: 'comm1',
    slug: 'community-slug',
    name: 'My Community',
    isPrivate: false,
  };
  const fakeChannel = {
    id: 'chan1',
    slug: 'test-channel',
    name: 'Test Channel',
    description: 'A test channel',
    isPrivate: false,
    community: fakeCommunity,
  };

  it('renders main fields and allows editing', () => {
    const store = createStore(reducer, {});
    const editChannel = jest.fn(() =>
      Promise.resolve({ data: { editChannel: fakeChannel } })
    );
    const dispatch = jest.fn();
    // Patch store.dispatch so component's this.props.dispatch calls it
    store.dispatch = dispatch;
    const {
      getByDisplayValue,
      getByText,
      getByLabelText,
      getByRole,
      container,
    } = renderWithStore(
      <Channel channel={fakeChannel} editChannel={editChannel} />,
      { store }
    );
    // Inputs should exist
    expect(getByDisplayValue('Test Channel')).toBeInTheDocument();
    expect(getByDisplayValue('A test channel')).toBeInTheDocument();
    // Link to channel
    expect(getByText('View Channel')).toHaveAttribute(
      'href',
      '/community-slug/test-channel'
    );
    // Change name to invalid (whitespace)
    const nameInput = container.querySelector('[data-cy="channel-name-input"]');
    fireEvent.change(nameInput, { target: { id: 'name', value: 'bad name' } });
    expect(container.textContent).toContain('can`t have invalid characters');
    // Save button should be disabled if error
    const saveBtn = container.querySelector('[data-cy="save-button"]');
    expect(saveBtn).toBeDisabled();
    // Change name to valid, should remove error and enable save
    fireEvent.change(nameInput, { target: { id: 'name', value: 'GoodName' } });
    expect(container.textContent).not.toContain(
      'can`t have invalid characters'
    );
    expect(saveBtn).not.toBeDisabled();
    // Click save, should call editChannel
    fireEvent.click(saveBtn);
    expect(editChannel).toHaveBeenCalled();
  });

  it('save handles success and dispatches success toast', async () => {
    const store = createStore(reducer, {});
    const editChannel = jest.fn(() =>
      Promise.resolve({ data: { editChannel: fakeChannel } })
    );
    const dispatch = jest.fn();
    store.dispatch = dispatch;
    const { container } = renderWithStore(
      <Channel channel={fakeChannel} editChannel={editChannel} />,
      { store }
    );
    const saveBtn = container.querySelector('[data-cy="save-button"]');
    // Should not be loading initially
    expect(saveBtn.textContent).toMatch(/Save/);
    // Click save
    fireEvent.click(saveBtn);
    // Should show loading (Saving...)
    expect(saveBtn.textContent).toMatch(/Saving/);
    // Wait for editChannel async completion
    await waitFor(() => expect(dispatch).toHaveBeenCalled());
    // Should dispatch a toast of type 'success'
    const toastTypes = dispatch.mock.calls.map(call => call[0]).join();
    expect(toastTypes).toMatch(/addToastWithTimeout|success|saved/i); // Partial match
  });

  it('save handles failure and dispatches error toast', async () => {
    const store = createStore(reducer, {});
    const editChannel = jest.fn(() => Promise.reject(new Error('boom')));
    const dispatch = jest.fn();
    store.dispatch = dispatch;
    const { container } = renderWithStore(
      <Channel channel={fakeChannel} editChannel={editChannel} />,
      { store }
    );
    const saveBtn = container.querySelector('[data-cy="save-button"]');
    fireEvent.click(saveBtn);
    // Should show loading
    expect(saveBtn.textContent).toMatch(/Saving/);
    // Wait for rejection/dispatch
    await waitFor(() => expect(dispatch).toHaveBeenCalled());
    // Should dispatch a toast of type 'error'
    const toastCalls = dispatch.mock.calls
      .map(call => JSON.stringify(call[0]))
      .join();
    expect(toastCalls).toMatch(/error|boom/i);
  });

  it('delete channel dispatches modal open with correct payload', () => {
    const store = createStore(reducer, {});
    const editChannel = jest.fn(() =>
      Promise.resolve({ data: { editChannel: fakeChannel } })
    );
    const dispatch = jest.fn();
    store.dispatch = dispatch;
    const { container } = renderWithStore(
      <Channel channel={fakeChannel} editChannel={editChannel} />,
      { store }
    );
    // Only channels whose slug is not "general" show delete button
    const deleteBtn = container.querySelector(
      '[data-cy="delete-channel-button"]'
    );
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    // Should dispatch openModal with correct structure
    expect(dispatch).toHaveBeenCalled();
    const modalCall = dispatch.mock.calls.find(
      call => call && /DELETE_DOUBLE_CHECK_MODAL/.test(JSON.stringify(call[0]))
    );
    expect(modalCall).toBeTruthy();
    expect(JSON.stringify(modalCall[0])).toMatch(/DELETE_DOUBLE_CHECK_MODAL/);
    expect(JSON.stringify(modalCall[0])).toMatch(/chan1/);
    expect(JSON.stringify(modalCall[0])).toMatch(/channel/);
    expect(JSON.stringify(modalCall[0])).toMatch(/community-slug/);
  });

  it('shows NullCard if no channel', () => {
    const store = createStore(reducer, {});
    const editChannel = jest.fn();
    const dispatch = jest.fn();
    store.dispatch = dispatch;
    const { getByText } = renderWithStore(
      <Channel editChannel={editChannel} />,
      { store }
    );
    expect(getByText(/doesn't exist yet/i)).toBeInTheDocument();
    expect(getByText(/Create/i)).toBeInTheDocument();
  });
});
