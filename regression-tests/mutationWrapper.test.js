import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MutationWrapper from 'src/views/communityMembers/components/mutationWrapper';

// Helper to render with a mock store and capture dispatched actions
const renderWithStore = (ui, { initialState } = {}) => {
  const mockStore = configureStore([thunk]);
  const store = mockStore(initialState || {});
  const utils = render(<Provider store={store}>{ui}</Provider>);
  return { store, ...utils };
};

const renderContent = state => (
  <React.Fragment>
    <span>{state.isLoading ? 'Loading…' : 'Idle'}</span>
  </React.Fragment>
);

describe('MutationWrapper', () => {
  test('renders and toggles loading on click, dispatches success toast', async () => {
    const mutation = jest.fn(() => Promise.resolve());
    const { store } = renderWithStore(
      <MutationWrapper
        mutation={mutation}
        variables={{}}
        render={renderContent}
      />
    );

    // Initial state
    expect(screen.getByText('Idle')).toBeInTheDocument();

    // Click triggers init -> loading
    fireEvent.click(screen.getByText('Idle'));
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    // Wait for mutation to resolve microtask queue
    await Promise.resolve();

    // After success, loading terminates
    expect(screen.getByText('Idle')).toBeInTheDocument();

    // Verify success toast dispatched
    const actions = store.getActions();
    const successToast = actions.find(
      a => a && a.type === 'ADD_TOAST' && a.toast && a.toast.type === 'success'
    );
    expect(successToast).toBeTruthy();
    expect(successToast.toast && successToast.toast.message).toBe(
      'Saved permissions'
    );
  });

  test('dispatches error toast on mutation failure', async () => {
    const error = new Error('Boom');
    const mutation = jest.fn(() => Promise.reject(error));
    const { store } = renderWithStore(
      <MutationWrapper
        mutation={mutation}
        variables={{}}
        render={renderContent}
      />
    );

    fireEvent.click(screen.getByText('Idle'));
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    // Let rejection propagate through catch
    await Promise.resolve();

    // Terminates back to idle
    expect(screen.getByText('Idle')).toBeInTheDocument();

    const actions = store.getActions();
    const errorToast = actions.find(
      a => a && a.type === 'ADD_TOAST' && a.toast && a.toast.type === 'error'
    );
    expect(errorToast).toBeTruthy();
    expect(errorToast.toast && errorToast.toast.message).toBe('Boom');
  });
});
