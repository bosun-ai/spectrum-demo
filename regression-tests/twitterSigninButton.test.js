const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the named export directly
const {
  TwitterSigninButton,
} = require('../src/components/loginButtonSet/twitter');

describe('TwitterSigninButton', () => {
  test('renders with label and twitter icon', () => {
    render(
      React.createElement(TwitterSigninButton, {
        href: 'http://localhost/auth/twitter?r=/home',
        preferred: false,
        showAfter: false,
      })
    );

    // Label text should be present
    expect(screen.getByText(/log in with twitter/i)).toBeTruthy();

    // There should be an anchor with provided href
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('/auth/twitter');
    expect(decodeURIComponent(link.getAttribute('href'))).toContain('r=/home');
  });

  test('invokes onClickHandler with provider "twitter"', () => {
    const handler = jest.fn();
    render(
      React.createElement(TwitterSigninButton, {
        href: 'http://localhost/auth/twitter?r=/home',
        preferred: true,
        showAfter: true,
        onClickHandler: handler,
      })
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('twitter');
  });
});
