/* eslint-disable import/no-commonjs */
// Regression test for CommunityView rendering logic
const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the unconnected component by requiring default and accessing the composed result
// We will mock HOCs to pass props directly and avoid network calls.
jest.mock('src/components/viewNetworkHandler', () => props =>
  props.children || null
);
jest.mock('src/components/withCurrentUser', () => Comp => Comp);
jest.mock('shared/graphql/queries/community/getCommunity', () => ({
  getCommunityByMatch: Comp => Comp,
}));
jest.mock('react-redux', () => ({ connect: () => Comp => Comp }));

// Mock child components used by CommunityView to simple markers
jest.mock('src/views/viewHelpers', () => ({
  ErrorView: () => React.createElement('div', { 'data-testid': 'error-view' }),
  LoadingView: () =>
    React.createElement('div', { 'data-testid': 'loading-view' }),
}));
jest.mock('src/views/login', () => ({
  __esModule: true,
  default: ({ redirectPath }) =>
    React.createElement('div', { 'data-testid': 'login-view' }, redirectPath),
}));
jest.mock('src/views/community/containers/signedIn', () => ({
  SignedIn: ({ community }) =>
    React.createElement(
      'div',
      { 'data-testid': 'signed-in' },
      community && community.slug
    ),
}));
jest.mock('src/views/community/containers/privateCommunity', () => ({
  PrivateCommunity: ({ community }) =>
    React.createElement(
      'div',
      { 'data-testid': 'private-community' },
      community && community.slug
    ),
}));

const CommunityView = require('src/views/community').default;

const baseCommunity = {
  id: 'c1',
  slug: 'test-community',
  name: 'Test Community',
  description: 'Desc',
  communityPermissions: { isMember: false, isBlocked: false, isPending: false },
  isPrivate: false,
};

const baseProps = {
  isLoading: false,
  queryVarIsChanging: false,
  hasError: false,
  currentUser: { id: 'u1', name: 'User' },
  match: { params: { communitySlug: 'test-community' } },
  data: { community: baseCommunity },
};

describe('CommunityView', () => {
  test('renders SignedIn for public community when user not a member', () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, baseProps)
      )
    );
    expect(screen.queryByTestId('signed-in')).toBeInTheDocument();
    expect(screen.queryByTestId('error-view')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-view')).not.toBeInTheDocument();
    expect(screen.queryByTestId('private-community')).not.toBeInTheDocument();
  });

  test('shows ErrorView when blocked', () => {
    const blockedProps = {
      ...baseProps,
      data: {
        community: {
          ...baseCommunity,
          communityPermissions: { isMember: false, isBlocked: true },
        },
      },
    };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, blockedProps)
      )
    );
    expect(screen.queryByTestId('error-view')).toBeInTheDocument();
  });

  test('redirects to Login for private community when not signed in', () => {
    const privateProps = {
      ...baseProps,
      currentUser: null,
      data: {
        community: { ...baseCommunity, isPrivate: true },
      },
    };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, privateProps)
      )
    );
    expect(screen.queryByTestId('login-view')).toBeInTheDocument();
  });

  test('renders PrivateCommunity when private and signed in but not a member', () => {
    const privateSignedInProps = {
      ...baseProps,
      data: {
        community: {
          ...baseCommunity,
          isPrivate: true,
          communityPermissions: { isMember: false, isBlocked: false },
        },
      },
    };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, privateSignedInProps)
      )
    );
    expect(screen.queryByTestId('private-community')).toBeInTheDocument();
  });

  test('renders LoadingView when loading or queryVarIsChanging', () => {
    const loadingProps = { ...baseProps, isLoading: true };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, loadingProps)
      )
    );
    expect(screen.queryByTestId('loading-view')).toBeInTheDocument();
  });

  test('renders ErrorView when no community or hasError', () => {
    const errorProps = { ...baseProps, hasError: true };
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(CommunityView, errorProps)
      )
    );
    expect(screen.queryByTestId('error-view')).toBeInTheDocument();
  });
});
