// Regression test for src/views/userSettings/components/deleteAccountForm.js
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Mock HOCs to identity functions to avoid providers
jest.mock('react-redux', () => ({ connect: () => x => x }));
jest.mock('src/components/viewNetworkHandler', () => x => x);

// Mock graphql HOCs to passthrough and provide props shape if needed
jest.mock('shared/graphql/mutations/user/deleteCurrentUser', () => ({
  __esModule: true,
  default: x => x,
}));

jest.mock('shared/graphql/queries/user/getUserCommunityConnection', () => ({
  __esModule: true,
  getCurrentUserCommunityConnection: x => x,
}));

// Mock button components to simple buttons
jest.mock('src/components/button', () => ({
  HoverWarnOutlineButton: ({ children, ...props }) =>
    React.createElement('button', props, children),
  WarnButton: ({ children, ...props }) =>
    React.createElement('button', props, children),
  OutlineButton: ({ children, ...props }) =>
    React.createElement('button', props, children),
}));

// Mock styled components used for layout
jest.mock('src/components/settingsViews/style', () => ({
  SectionCard: ({ children, ...props }) =>
    React.createElement('div', props, children),
  SectionTitle: ({ children }) => React.createElement('h1', null, children),
  SectionSubtitle: ({ children }) => React.createElement('p', null, children),
  SectionCardFooter: ({ children }) =>
    React.createElement('div', null, children),
}));

jest.mock('src/components/listItems/style', () => ({
  Notice: ({ children, ...props }) =>
    React.createElement('div', props, children),
}));

jest.mock('src/components/loading', () => ({
  Loading: () => React.createElement('div', null, 'Loading...'),
}));

// Mock toast action to noop
jest.mock('src/actions/toasts', () => ({
  addToastWithTimeout: jest.fn(() => ({ type: 'ADD_TOAST' })),
}));

// Mock constants to avoid navigation side-effects
jest.mock('src/api/constants', () => ({
  SERVER_URL: 'https://server.example',
}));

const DeleteAccountForm = require('src/views/userSettings/components/deleteAccountForm')
  .default;

const baseUser = {
  id: 'user-123',
  communityConnection: {
    edges: [
      {
        node: { communityPermissions: { isOwner: false } },
      },
    ],
  },
};

const buildProps = ({ user = baseUser, isLoading = false } = {}) => ({
  data: { user },
  isLoading,
  dispatch: jest.fn(),
  deleteCurrentUser: jest.fn(() => Promise.resolve()),
});

describe('DeleteAccountForm regression', () => {
  it('renders initial state and toggles delete confirmation', () => {
    const props = buildProps();
    render(React.createElement(DeleteAccountForm, props));

    // Initial render shows delete init button
    const initBtn = screen.getByText('Delete my account');
    expect(initBtn).toBeTruthy();

    // Click to init delete
    fireEvent.click(initBtn);

    // After init, confirm and cancel buttons appear
    expect(screen.getByText('Confirm and delete my account')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  it('shows owner notice when user owns communities', () => {
    const ownerUser = {
      id: 'user-456',
      communityConnection: {
        edges: [{ node: { communityPermissions: { isOwner: true } } }],
      },
    };
    const props = buildProps({ user: ownerUser });
    render(React.createElement(DeleteAccountForm, props));

    // Trigger componentDidUpdate to compute ownsCommunities
    // Re-render with same props to simulate update
    // Note: in testing-library, state update happens automatically after mount
    expect(
      screen.getByTestId('owns-communities-notice') ||
        screen.getByText(/own communities on Spectrum/i)
    ).toBeTruthy();
  });

  it('calls deleteCurrentUser and shows loading state on confirm', async () => {
    const props = buildProps();
    render(React.createElement(DeleteAccountForm, props));

    fireEvent.click(screen.getByText('Delete my account'));
    const confirmBtn = screen.getByText('Confirm and delete my account');
    fireEvent.click(confirmBtn);

    // Button switches to loading copy
    expect(screen.getByText('Deleting...')).toBeTruthy();

    // deleteCurrentUser should have been called
    expect(props.deleteCurrentUser).toHaveBeenCalled();
  });

  it('renders loading card when data user missing and isLoading true', () => {
    const props = buildProps({ user: null, isLoading: true });
    render(React.createElement(DeleteAccountForm, props));
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
