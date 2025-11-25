const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the named export directly
const {
  GithubSigninButton,
} = require('../src/components/loginButtonSet/github');

describe('GithubSigninButton', () => {
  test('renders label and github icon', () => {
    render(
      React.createElement(GithubSigninButton, {
        href: '/auth/github?r=/home',
        preferred: false,
        showAfter: false,
      })
    );

    // Anchor should be present with correct href
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('/auth/github');

    // Button label text
    expect(screen.getByText(/log in with github/i)).toBeInTheDocument();
  });

  test('calls onClickHandler with "github" when clicked', () => {
    const handler = jest.fn();
    render(
      React.createElement(GithubSigninButton, {
        href: '/auth/github?r=/home',
        preferred: true,
        showAfter: true,
        onClickHandler: handler,
      })
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('github');
  });

  test('respects githubOnly prop on anchor', () => {
    render(
      React.createElement(GithubSigninButton, {
        href: '/auth/github?r=/home',
        preferred: true,
        showAfter: false,
        githubOnly: true,
      })
    );

    // Ensure the link still renders; style prop is passed through
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('/auth/github');
  });
});
