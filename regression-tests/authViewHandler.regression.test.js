// Regression test for the AuthViewHandler component
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// AuthViewHandler default export is the composed one (with redux, router, GraphQL HOCs)
import AuthViewHandler from '../src/views/authViewHandler/index.js';

// Mock NewUserOnboarding to check if it's rendered
jest.mock('../src/views/newUserOnboarding', () => () => (
  <div data-testid="new-user-onboarding">Onboarding</div>
));

// Mock children function
const Children = authed => (
  <div data-testid="children">{authed ? 'Authed' : 'Not authed'}</div>
);

// Since the component expects router/redux context, use wrappers
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
const mockStore = configureStore([]);

function renderWithProviders(ui, { reduxState = {}, route = '/', store } = {}) {
  // Use the provided store or create one
  const usedStore = store || mockStore(reduxState);
  return render(
    <Provider store={usedStore}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
}

describe('AuthViewHandler regression', () => {
  it('renders onboarding screen if user has no username', () => {
    const user = { id: '1', username: undefined };
    const data = { user, loading: false };
    const { getByTestId } = renderWithProviders(
      <AuthViewHandler data={data} children={Children} editUser={jest.fn()} />,
      {}
    );
    expect(getByTestId('new-user-onboarding')).toBeInTheDocument();
  });

  it('renders children(true) if user is authed (has id and username)', () => {
    const user = { id: '1', username: 'bob' };
    const data = { user, loading: false };
    const { getByTestId } = renderWithProviders(
      <AuthViewHandler data={data} children={Children} editUser={jest.fn()} />,
      {}
    );
    expect(getByTestId('children')).toHaveTextContent('Authed');
  });

  it('renders children(false) if not authed and not loading (user is null)', () => {
    const data = { user: null, loading: false };
    const { getByTestId } = renderWithProviders(
      <AuthViewHandler data={data} children={Children} editUser={jest.fn()} />,
      {}
    );
    expect(getByTestId('children')).toHaveTextContent('Not authed');
  });

  it('renders nothing if loading', () => {
    const data = { user: null, loading: true };
    const { container } = renderWithProviders(
      <AuthViewHandler data={data} children={Children} editUser={jest.fn()} />,
      {}
    );
    // Should not render onboarding or children
    expect(container).toBeEmptyDOMElement();
  });
});
