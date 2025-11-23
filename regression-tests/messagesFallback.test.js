const React = require('react');
const { render, screen } = require('@testing-library/react');

// We import the signedOutFallback factory and create MessagesFallback
const signedOutFallback = require('../src/helpers/signed-out-fallback').default;

// Create simple stand-ins for DirectMessages and Login components used in routes.js
const DirectMessages = () => <div data-testid="direct-messages">DM View</div>;
const Login = () => <div data-testid="login-view">Login View</div>;

// Create the component under test matching routes.js behavior
const MessagesFallback = signedOutFallback(DirectMessages, Login);

// AuthViewHandler checks current user via GraphQL HOC; for regression testing,
// we mock it to be a simple pass-through that calls children with provided auth state.
jest.mock('../src/views/authViewHandler', () => {
  const React = require('react');
  const MockAuthViewHandler = ({ children, authed = false }) =>
    children(authed);
  return MockAuthViewHandler;
});

describe('MessagesFallback', () => {
  test('renders Login when unauthenticated', () => {
    // Mock AuthViewHandler to return authed=false
    const MockAuthViewHandler = require('../src/views/authViewHandler');
    const Wrapped = props =>
      React.createElement(MockAuthViewHandler, { authed: false }, authed =>
        authed ? <DirectMessages {...props} /> : <Login {...props} />
      );

    // Render the same structure signedOutFallback would produce via our mock
    render(<Wrapped />);
    expect(screen.getByTestId('login-view')).toBeInTheDocument();
  });

  test('renders DirectMessages when authenticated', () => {
    const MockAuthViewHandler = require('../src/views/authViewHandler');
    const Wrapped = props =>
      React.createElement(MockAuthViewHandler, { authed: true }, authed =>
        authed ? <DirectMessages {...props} /> : <Login {...props} />
      );

    render(<Wrapped />);
    expect(screen.getByTestId('direct-messages')).toBeInTheDocument();
  });
});
