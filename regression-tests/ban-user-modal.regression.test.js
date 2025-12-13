/**
 * Regression test for BanUserModal component rendering.
 * Runs in jsdom via regression-tests/jest.config.js without DB/network.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';

// Import the connected component
import BanUserModal from '../src/components/modals/BanUserModal';

// Minimal reducer to provide required state shape for connect(map)
const reducer = (state = { modals: { isOpen: true } }, action) => state;

describe('BanUserModal regression', () => {
  it('renders modal with user name and disables ban when reason empty', () => {
    const store = createStore(reducer);

    // Provide minimal user prop expected by the component
    const user = { id: 'u1', name: 'Test User', username: 'testuser' };

    // Stub banUser to avoid network/DB; return resolved promise
    const banUser = () => Promise.resolve();

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* Use the unwrapped component to bypass HOCs that may expect more context */}
          <BanUserModal.WrappedComponent
            dispatch={store.dispatch}
            isOpen={true}
            user={user}
            currentUser={{ id: 'me' }}
            banUser={banUser}
          />
        </ThemeProvider>
      </Provider>
    );

    // Asserts contentLabel/title is rendered
    expect(screen.getByText(/Ban Test User/)).toBeInTheDocument();

    // Button disabled until reason entered
    const banButton = screen.getByRole('button', { name: /Ban User/i });
    expect(banButton).toBeDisabled();

    // Enter a reason enables the button
    const textarea = screen.getByPlaceholderText(/Add a reason/);
    fireEvent.change(textarea, { target: { value: 'spam' } });
    expect(banButton).not.toBeDisabled();
  });
});
