const React = require('react');
const { render } = require('@testing-library/react');

// Import the raw component class so we can inject props without HOCs
const AuthViewHandler = require('../src/views/authViewHandler/index.js')
  .default;

// Helper to create minimal props for the component
const baseProps = () => ({
  history: { replace: jest.fn() },
  location: { pathname: '/' },
  editUser: jest.fn(),
  children: authed =>
    React.createElement('div', {
      'data-testid': 'child',
      'data-authed': String(authed),
    }),
  data: { user: null, loading: false },
});

test('renders children with authed=false when no user and not loading', () => {
  const props = baseProps();
  const { getByTestId } = render(React.createElement(AuthViewHandler, props));
  const child = getByTestId('child');
  expect(child).toBeInTheDocument();
  expect(child.getAttribute('data-authed')).toBe('false');
});

test('renders null while loading', () => {
  const props = baseProps();
  props.data.loading = true;
  const { container } = render(React.createElement(AuthViewHandler, props));
  // No children rendered when loading
  expect(container.firstChild).toBeNull();
});

test('renders onboarding when user missing username', () => {
  const props = baseProps();
  props.data.user = { id: 'u1', username: null };
  const { container } = render(React.createElement(AuthViewHandler, props));
  // NewUserOnboarding does not set a test id; assert it does not render the child
  expect(container.querySelector('[data-testid="child"]')).toBeNull();
});

test('renders children with authed=true when user exists', () => {
  const props = baseProps();
  props.data.user = { id: 'u1', username: 'alice' };
  const { getByTestId } = render(React.createElement(AuthViewHandler, props));
  const child = getByTestId('child');
  expect(child).toBeInTheDocument();
  expect(child.getAttribute('data-authed')).toBe('true');
});

test('componentDidUpdate sets timezone and redirects from /home', () => {
  const props = baseProps();
  // Simulate coming from no user to a user without timezone while on /home
  props.location.pathname = '/home';
  props.data.user = null;

  const { rerender } = render(React.createElement(AuthViewHandler, props));

  // Update props to include a user without timezone
  const nextProps = {
    ...props,
    data: {
      user: { id: 'u1', username: 'alice', timezone: null },
      loading: false,
    },
  };
  rerender(React.createElement(AuthViewHandler, nextProps));

  // editUser should be called with timezone set
  expect(nextProps.editUser).toHaveBeenCalledTimes(1);
  const arg = nextProps.editUser.mock.calls[0][0];
  expect(typeof arg.timezone).toBe('number');

  // history.replace should be called to redirect from /home
  expect(nextProps.history.replace).toHaveBeenCalledWith('/');
});
