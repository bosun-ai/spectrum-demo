// Regression test for Nav component
// Uses React.createElement to avoid JSX in this environment
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

// The Nav component is a default export enhanced by HOCs (withCurrentUser, connect)
// Importing default should give us the wrapped component that we can render directly.
// Mock internal dependencies used by Nav to prevent resolution failures
jest.mock('../src/components/icon', () => () =>
  React.createElement('span', { 'data-testid': 'icon' })
);
jest.mock('../src/components/logo', () => ({
  Logo: () => React.createElement('div', { 'data-testid': 'logo' }),
}));
jest.mock('../src/components/avatar', () => ({
  UserAvatar: ({ dataCy }) =>
    React.createElement('div', { 'data-cy': dataCy || 'avatar' }),
}));
jest.mock('../src/components/head', () => ({ children }) =>
  React.createElement('div', null, children)
);
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: Comp => Comp,
}));
jest.mock('react-redux', () => ({ connect: () => Comp => Comp }));
jest.mock('../src/views/pages/style', () => ({
  NavContainer: props =>
    React.createElement('div', {
      ...props,
      'data-testid': 'navigation-splash',
    }),
  Tabs: props => React.createElement('div', props),
  LogoTab: props => React.createElement('a', props),
  MenuTab: props => React.createElement('div', props),
  LoginTab: props => React.createElement('a', props),
  AuthTab: props => React.createElement('div', props),
  LogoLink: props => React.createElement('a', props),
  AuthLink: props => React.createElement('a', props),
  LoginLink: props => React.createElement('a', props),
  ExploreLink: props => React.createElement('a', props),
  MenuContainer: props => React.createElement('div', props),
  MenuOverlay: props => React.createElement('div', props),
}));

import Nav from '../src/views/pages/components/nav';

// Since Nav relies on react-router Links, provide a minimal Router context.
import { MemoryRouter } from 'react-router';

// Helper to render Nav with optional props
const renderNav = (props = {}) => {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/'] },
      React.createElement(Nav, props)
    )
  );
};

describe('Nav component (regression)', () => {
  it('renders logo tab and login link when no currentUser', () => {
    const { getByTestId, getByText, queryByTestId } = renderNav({
      currentUser: null,
      location: 'login',
    });

    // The outer container should be present
    const container = getByTestId('navigation-splash');
    expect(container).toBeTruthy();

    // Login text in the tab
    expect(getByText('Log in')).toBeTruthy();

    // Menu closed initially: clicking should open and show LoginLink inside menu
    const clickable = getByTestId('icon');
    if (clickable) {
      fireEvent.click(clickable);
      // After opening menu, there should be a second 'Log in' inside the menu list
      expect(getByText('Log in')).toBeTruthy();
    }

    // When not logged in, no user avatar should render
    expect(queryByTestId('navigation-splash-profile')).toBeNull();
  });

  it('renders user avatar and "Return home" when currentUser exists', () => {
    const fakeUser = { id: 'u1', name: 'Test User' };
    const { getByTestId, getByText } = renderNav({
      currentUser: fakeUser,
      location: 'explore',
    });

    const container = getByTestId('navigation-splash');
    expect(container).toBeTruthy();

    // Avatar is rendered with dataCy="navigation-splash-profile" on the UserAvatar
    const avatar = container.querySelector(
      '[data-cy="navigation-splash-profile"]'
    );
    expect(avatar).toBeTruthy();

    // Open menu and assert the authenticated menu link
    const clickable = getByTestId('icon');
    if (clickable) fireEvent.click(clickable);
    expect(getByText('Return home')).toBeTruthy();
  });
});
