const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const { ApolloProvider } = require('react-apollo');
const { ThemeProvider } = require('styled-components');
const theme = require('../shared/theme').default || require('../shared/theme');

// Import the component under test
const SetUsername = require('../src/views/newUserOnboarding/components/setUsername')
  .default;

// Minimal no-op reducer for Provider
function noopReducer(state = {}) {
  return state;
}

// Minimal Apollo client mock with query+mutate
function createMockApolloClient() {
  return {
    // UsernameSearch will call client.query; return available by default
    query: jest.fn(() => Promise.resolve({ data: { user: null } })),
    // editUser HOC uses mutate under the hood; we don't rely on it directly here
    mutate: jest.fn(() => Promise.resolve({ data: { editUser: {} } })),
  };
}

// Helper to render SetUsername with required wrappers and props
function renderSetUsername(overrides = {}) {
  const store = createStore(noopReducer);
  const client = createMockApolloClient();

  // Provide a basic user so the component can prefill a slug
  const user = overrides.user || { name: 'Jane Doe' };

  // editUser from HOC gets injected, but we can override with a stub
  const editUser = overrides.editUser || (input => Promise.resolve(input));
  const save = overrides.save || jest.fn();

  // Compose props expected by the connected/apollo-wrapped component
  const props = {
    client,
    editUser,
    save,
    user,
    dispatch: store.dispatch,
    ...overrides,
  };

  // The exported component is wrapped by connect+withApollo+graphql
  // It expects Redux Provider and ApolloProvider context.
  const element = React.createElement(
    Provider,
    { store },
    React.createElement(
      ApolloProvider,
      { client },
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(SetUsername, props)
      )
    )
  );
  return render(element);
}

test('SetUsername renders and toggles button disabled state', async () => {
  const {
    getByText,
    getByTestId,
    queryByTestId,
    container,
  } = renderSetUsername();

  // Button should render with the default label
  const button = container.querySelector('[data-cy="save-username-button"]');
  expect(button).toBeInTheDocument();

  // With an initial suggested username from user.name, button should be enabled (no error)
  expect(button).not.toHaveAttribute('disabled');

  // Find the username input by data-cy set in UsernameSearch
  const input = container.querySelector('[data-cy="username-search"]');
  expect(input).toBeInTheDocument();

  // Enter empty value to trigger validation error and disabled button
  fireEvent.change(input, { target: { value: '' } });

  // Error should render; button should be disabled
  const errorEl = container.querySelector('[data-cy="username-search-error"]');
  expect(errorEl).toBeInTheDocument();
  expect(button).toHaveAttribute('disabled');

  // Enter a valid username and verify success appears and button enabled
  fireEvent.change(input, { target: { value: 'valid-user' } });

  // Wait for async validation to complete
  await Promise.resolve();
  await Promise.resolve();

  const successEl = container.querySelector(
    '[data-cy="username-search-success"]'
  );
  // Button should be enabled when there is a valid username and no error
  expect(button).not.toHaveAttribute('disabled');
});
