const React = require('react');
const { render } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { createStore } = require('redux');
const { MemoryRouter } = require('react-router');

// Import the connected component default export
const CommunitySettings = require('../src/views/communitySettings/index.js')
  .default;

// Minimal reducer for dispatching titlebar actions safely
function reducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function getMockCommunity(overrides = {}) {
  return {
    id: 'comm_1',
    slug: 'test-community',
    name: 'Test Community',
    profilePhoto: 'https://example.com/photo.png',
    communityPermissions: { isOwner: true, isModerator: true },
    ...overrides,
  };
}

// Helper to render the component with required providers and props
function renderWithProviders(uiProps = {}) {
  const store = createStore(reducer);
  const defaultProps = {
    data: { community: getMockCommunity() },
    isLoading: false,
    hasError: false,
    location: { pathname: '/test-community/settings' },
    match: {
      url: '/test-community/settings',
      params: { communitySlug: 'test-community' },
    },
    history: { push: jest.fn(), replace: jest.fn() },
    dispatch: store.dispatch,
  };
  const props = { ...defaultProps, ...uiProps };

  return render(
    React.createElement(
      Provider,
      { store },
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunitySettings, props)
      )
    )
  );
}

test('renders CommunitySettings overview with subnav', () => {
  const { getByText, getByTestId } = renderWithProviders();

  // Root container should be present
  expect(getByTestId('community-settings')).toBeInTheDocument();

  // Header and segmented control labels
  expect(getByText('Settings')).toBeInTheDocument();
  expect(getByText('Overview')).toBeInTheDocument();
  expect(getByText('Members')).toBeInTheDocument();
});

test('shows error when user cannot view settings', () => {
  const community = getMockCommunity({
    communityPermissions: { isOwner: false, isModerator: false },
  });
  const { getByText } = renderWithProviders({ data: { community } });

  // ErrorView renders a generic error; assert presence via common text
  // If ErrorView does not render text, this will still ensure no crash
  expect(getByText(/error/i)).toBeTruthy();
});
