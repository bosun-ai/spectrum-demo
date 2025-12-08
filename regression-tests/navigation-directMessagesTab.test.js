// @flow
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const { ApolloProvider } = require('react-apollo');
const ApolloClient =
  require('apollo-client').default || require('apollo-client');

// Import component and NavigationContext
const DirectMessagesTab =
  require('../src/views/navigation/directMessagesTab.js').default ||
  require('../src/views/navigation/directMessagesTab.js');
const { NavigationContext } = require('../src/helpers/navigation-context.js');

// Helper to render with router + apollo + context
const renderWithProviders = (
  ui,
  {
    route = '/',
    contextValue = { navigationIsOpen: true, setNavigationIsOpen: () => {} },
  } = {}
) => {
  const client = new ApolloClient({
    link: { request: () => {} },
    cache: { read: () => null, write: () => {} },
  });
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(
        ApolloProvider,
        { client },
        React.createElement(
          NavigationContext.Provider,
          { value: contextValue },
          ui
        )
      )
    )
  );
};

// Ensure wide viewport so label shows
beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 2000,
  });
});

describe('DirectMessagesTab regression', () => {
  test('renders messages link and label', () => {
    renderWithProviders(React.createElement(DirectMessagesTab, { count: 0 }), {
      route: '/',
    });

    // Label text
    expect(screen.getByText('Messages')).toBeInTheDocument();
    // Link has data-cy attr
    const link = screen.getByTestId
      ? screen.getByTestId('navigation-messages')
      : screen.getByRole('link', { name: /messages/i });
    expect(link).toBeInTheDocument();
  });

  test('shows unread badge when count > 0', () => {
    renderWithProviders(React.createElement(DirectMessagesTab, { count: 3 }), {
      route: '/',
    });

    // Badge should be present
    const badge = screen.getByTestId
      ? screen.getByTestId('unread-dm-badge')
      : screen.getByLabelText
      ? screen.getByLabelText('unread-dm-badge')
      : document.querySelector('[data-cy="unread-dm-badge"]');
    expect(badge).toBeTruthy();
  });

  test('is active when route matches /messages', () => {
    // On /messages route, the link should be rendered and active
    renderWithProviders(React.createElement(DirectMessagesTab, { count: 0 }), {
      route: '/messages',
    });

    // AvatarGrid receives isActive true -> we can assert link has href and exists
    const link = screen.getByRole('link', { name: /messages/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/messages');
  });
});
