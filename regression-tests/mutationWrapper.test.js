import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MutationWrapper from '../src/views/communityMembers/components/mutationWrapper';

// Helper to render with minimal redux Provider; component uses connect() for dispatch
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = createStore((state = {}) => state);

describe('MutationWrapper component regression', () => {
  it('renders children via render prop and triggers mutation on click', async () => {
    const variables = { foo: 'bar' };
    const mockMutation = jest.fn(() => Promise.resolve());
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MutationWrapper
          mutation={mockMutation}
          variables={variables}
          render={state => (
            <button disabled={state.isLoading}>Save permissions</button>
          )}
        />
      </Provider>
    );

    // Renders child from render prop
    const btn = screen.getByRole('button', { name: /save permissions/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toHaveAttribute('disabled');

    // Click triggers init -> mutate; sets loading state then resets
    await userEvent.click(btn);
    expect(mockMutation).toHaveBeenCalledWith(variables);

    // Toast dispatched on success
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('dispatches error toast and resets loading on mutation failure', async () => {
    const error = new Error('Nope');
    const failingMutation = jest.fn(() => Promise.reject(error));
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MutationWrapper
          mutation={failingMutation}
          variables={{}}
          render={state => <button disabled={state.isLoading}>Go</button>}
        />
      </Provider>
    );

    const btn = screen.getByRole('button', { name: /go/i });
    await userEvent.click(btn);
    expect(failingMutation).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('does nothing when mutation is not provided', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const renderSpy = jest.fn(state => <button>Nothing</button>);

    render(
      <Provider store={store}>
        <MutationWrapper mutation={null} variables={{}} render={renderSpy} />
      </Provider>
    );

    const btn = screen.getByRole('button', { name: /nothing/i });
    await userEvent.click(btn);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
