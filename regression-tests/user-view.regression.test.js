import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// Import the connected composed component
// Import raw component to avoid connect HOC child issues
import ConnectedUserView from '../src/views/user';
const UserView = ConnectedUserView.WrappedComponent || ConnectedUserView;

// Mock Head to avoid react-helmet-async context issues in jsdom
jest.mock('../src/components/head', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="head">{children}</div>,
}));

// The view composes GraphQL HOCs; we mock them to inject props
jest.mock('../shared/graphql/queries/user/getUser', () => ({
  getUserByMatch: Component => props => (
    <Component
      {...props}
      data={{
        user: {
          id: 'u1',
          name: 'Ada Lovelace',
          username: 'ada',
          description: 'First programmer',
          profilePhoto: 'http://example.com/ada.png',
        },
      }}
    />
  ),
}));

jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Component => props => (
    <Component {...props} currentUser={{ id: 'me' }} />
  ),
}));

jest.mock('../src/components/viewNetworkHandler', () => Component => props => (
  <Component {...props} isLoading={false} queryVarIsChanging={false} />
));

// Avoid rendering heavy children; replace with simple stubs
jest.mock('../src/components/threadFeed', () => {
  return function ThreadFeedStub(props) {
    return (
      <div data-testid="thread-feed">
        {`ThreadFeed kind=${props.kind} viewContext=${props.viewContext}`}
      </div>
    );
  };
});

jest.mock(
  '../shared/graphql/queries/user/getUserThreadConnection',
  () => () => Comp => Comp
);

jest.mock('../src/components/entities', () => ({
  UserProfileCard: ({ user }) => (
    <div data-testid="user-profile-card">{user.name}</div>
  ),
}));

jest.mock('../src/components/titlebar/actions', () => ({
  MobileUserAction: () => <div data-testid="mobile-user-action" />,
}));

jest.mock('../src/components/avatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar" />,
}));

jest.mock('../src/views/user/components/communityList', () => () => (
  <div data-testid="community-list">Communities</div>
));

// A minimal redux store stub; titlebar props are dispatched but unused here
const createStoreStub = () => ({
  getState: () => ({}),
  subscribe: () => () => {},
  dispatch: () => {},
});

function renderUserView(initialSearch = '') {
  const history = createMemoryHistory({
    initialEntries: [{ pathname: '/users/ada', search: initialSearch }],
  });
  const store = createStoreStub();
  return render(
    <Provider store={store}>
      <Router history={history}>
        <UserView
          match={{ params: { username: 'ada' } }}
          location={history.location}
          history={history}
        />
      </Router>
    </Provider>
  );
}

test('UserView defaults to Posts tab and switches tabs', async () => {
  renderUserView('');

  // Default tab is set to posts; ThreadFeed should render with creator context
  const postsTab = screen.getByRole('button', { name: /posts/i });
  const activityTab = screen.getByRole('button', { name: /activity/i });

  expect(postsTab).toHaveAttribute('data-cy', 'user-posts-tab');
  expect(activityTab).toHaveAttribute('data-cy', 'user-activity-tab');

  // Thread feed renders with posts (creator)
  expect(screen.getByTestId('thread-feed')).toHaveTextContent('kind=creator');

  // Switch to activity
  await userEvent.click(activityTab);
  expect(screen.getByTestId('thread-feed')).toHaveTextContent(
    'kind=participant'
  );
});

test('UserView Info tab renders profile and communities', async () => {
  renderUserView('?tab=info');

  // Info tab active; shows profile card and community list
  const cards = screen.getAllByTestId('user-profile-card');
  expect(cards[0]).toHaveTextContent('Ada Lovelace');
  const communities = screen.getAllByTestId('community-list');
  expect(communities.length).toBeGreaterThan(0);
  // No ThreadFeed when info tab selected
  expect(screen.queryByTestId('thread-feed')).toBeNull();
});
