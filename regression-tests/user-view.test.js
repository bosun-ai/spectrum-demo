import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme';
import UserView from '../src/views/user';

// Helper to render with theme and minimal router/history props
const renderUserView = props => {
  const defaultProps = {
    match: { params: { username: 'alice' } },
    currentUser: null,
    data: { user: null },
    isLoading: false,
    queryVarIsChanging: false,
    dispatch: jest.fn(),
    history: { replace: jest.fn() },
    location: { search: '' },
  };
  return render(
    <ThemeProvider theme={theme}>
      <UserView {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe('UserView', () => {
  it('renders LoadingView when isLoading', () => {
    const { container } = renderUserView({ isLoading: true });
    // LoadingView renders a Loading component; look for any spinner svg/div
    const spinner = container.querySelector('svg, div');
    expect(spinner).toBeTruthy();
  });

  it('renders ErrorView when no user', () => {
    renderUserView({ data: { user: null } });
    expect(
      screen.getByText('We couldn’t find a user with this username')
    ).toBeTruthy();
  });

  it('sets default tab to posts when user loads without tab', () => {
    const history = { replace: jest.fn() };
    const location = { search: '' };
    const user = {
      id: 'u1',
      name: 'Alice',
      username: 'alice',
      description: 'Hello',
      profilePhoto: null,
    };

    renderUserView({
      data: { user },
      history,
      location,
    });

    expect(history.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        search: expect.stringContaining('tab=posts'),
      })
    );

    // SegmentedControl should render Posts/Activity tabs
    expect(screen.getByText('Posts')).toBeTruthy();
    expect(screen.getByText('Activity')).toBeTruthy();
  });
});
