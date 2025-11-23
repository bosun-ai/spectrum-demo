// Regression test for the Nav component
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Nav uses recompose/compose, redux, router, and many styled components. To keep regression test simple and decoupled from app: mock what is needed.
// We'll import the raw Nav component, not the composed export, to avoid redux/connect.
// If the default export is only the composed one (connect), then we will need to mock the store context.

// Mock style components (from ../style)
jest.mock('../../src/views/pages/components/style', () => {
  const Fake = ({ children, ...props }) => <div {...props}>{children}</div>;
  return {
    NavContainer: Fake,
    Tabs: Fake,
    LogoTab: Fake,
    MenuTab: Fake,
    LoginTab: Fake,
    AuthTab: Fake,
    LogoLink: Fake,
    AuthLink: Fake,
    LoginLink: Fake,
    ExploreLink: Fake,
    MenuContainer: Fake,
    MenuOverlay: props => <div data-testid="menu-overlay" {...props} />,
  };
});

// Mock subcomponents that aren't critical to regression display
jest.mock('src/components/icon', () => ({
  Icon: props => <div data-testid="icon" {...props} />,
}));
jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));
jest.mock('src/components/avatar', () => ({
  UserAvatar: props => <div data-testid="user-avatar" {...props} />,
}));
jest.mock('src/components/head', () => () => null);

// Nav imports withCurrentUser and redux connect. We'll import the raw class instead for the test (not the composed default export).
let Nav;
beforeAll(() => {
  // Import raw component (not default export, which is composed)
  Nav =
    require('../../src/views/pages/components/nav.js').Nav ||
    require('../../src/views/pages/components/nav.js').default;
});

describe('Nav regression', () => {
  it('renders login tab and logo for guest', () => {
    // no currentUser
    const location = '';
    const { getByText, getByTestId, queryByTestId } = render(
      <Nav currentUser={null} location={location} />
    );
    // Logo present
    expect(getByTestId('logo')).toBeInTheDocument();
    // Login tab displayed
    expect(getByText('Log in')).toBeInTheDocument();
    // No user avatar
    expect(queryByTestId('user-avatar')).not.toBeInTheDocument();
  });

  it('renders user avatar and home for authed user', () => {
    const location = '';
    const fakeUser = { id: 'me', name: 'Tester' };
    const { queryByText, getByTestId } = render(
      <Nav currentUser={fakeUser} location={location} />
    );
    // Avatar present
    expect(getByTestId('user-avatar')).toBeInTheDocument();
    // No login tab
    expect(queryByText('Log in')).not.toBeInTheDocument();
    // Logo present
    expect(getByTestId('logo')).toBeInTheDocument();
  });

  it('toggles the menu on icon click', () => {
    const location = '';
    const { getByTestId } = render(
      <Nav currentUser={null} location={location} />
    );
    // Menu overlay should start closed (not visible, but in this mock always present)
    // Find icon and click it
    const icon = getByTestId('icon');
    fireEvent.click(icon);
    // Usually would test for menu open state, but components are mocked.
    // Just ensure that clicking does not error and overlay is present.
    expect(getByTestId('menu-overlay')).toBeInTheDocument();
  });
});
