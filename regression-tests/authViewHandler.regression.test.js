// Regression test for the AuthViewHandler component
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
// Mock NewUserOnboarding to check if it's rendered
jest.mock('../src/views/newUserOnboarding', () => () => (
  <div data-testid="new-user-onboarding">Onboarding</div>
));

// Mock children function
const Children = authed => (
  <div data-testid="children">{authed ? 'Authed' : 'Not authed'}</div>
);

// Import the unwrapped AuthViewHandler class if possible
let AuthViewHandler = require('../src/views/authViewHandler/index.js');
if (
  AuthViewHandler &&
  AuthViewHandler.default &&
  AuthViewHandler.default.WrappedComponent
) {
  AuthViewHandler = AuthViewHandler.default.WrappedComponent;
} else if (AuthViewHandler && AuthViewHandler.default) {
  AuthViewHandler = AuthViewHandler.default;
}

describe('AuthViewHandler regression', () => {
  it('renders onboarding screen if user has no username', () => {
    const user = { id: '1', username: undefined };
    const data = { user, loading: false };
    const props = {
      data,
      children: Children,
      editUser: jest.fn(),
      history: {},
      location: {},
    };
    const { getByTestId } = render(<AuthViewHandler {...props} />);
    expect(getByTestId('new-user-onboarding')).toBeInTheDocument();
  });

  it('renders children(true) if user is authed (has id and username)', () => {
    const user = { id: '1', username: 'bob' };
    const data = { user, loading: false };
    const props = {
      data,
      children: Children,
      editUser: jest.fn(),
      history: {},
      location: {},
    };
    const { getByTestId } = render(<AuthViewHandler {...props} />);
    expect(getByTestId('children')).toHaveTextContent('Authed');
  });

  it('renders children(false) if not authed and not loading (user is null)', () => {
    const data = { user: null, loading: false };
    const props = {
      data,
      children: Children,
      editUser: jest.fn(),
      history: {},
      location: {},
    };
    const { getByTestId } = render(<AuthViewHandler {...props} />);
    expect(getByTestId('children')).toHaveTextContent('Not authed');
  });

  it('renders nothing if loading', () => {
    const data = { user: null, loading: true };
    const props = {
      data,
      children: Children,
      editUser: jest.fn(),
      history: {},
      location: {},
    };
    const { container } = render(<AuthViewHandler {...props} />);
    // Should not render onboarding or children
    expect(container).toBeEmptyDOMElement();
  });
});
