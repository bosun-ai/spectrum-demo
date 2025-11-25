const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

// Import the named export directly
const {
  FacebookSigninButton,
} = require('../src/components/loginButtonSet/facebook');

describe('FacebookSigninButton', () => {
  test('renders label and facebook icon', () => {
    render(
      React.createElement(FacebookSigninButton, {
        href: '/auth/facebook?r=/home',
        preferred: false,
        showAfter: false,
      })
    );

    // Anchor should be present with correct href
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toContain('/auth/facebook');

    // Button label text
    expect(screen.getByText(/log in with facebook/i)).toBeInTheDocument();
  });

  test('calls onClickHandler with "facebook" when clicked', () => {
    const handler = jest.fn();
    render(
      React.createElement(FacebookSigninButton, {
        href: '/auth/facebook?r=/home',
        preferred: true,
        showAfter: true,
        onClickHandler: handler,
      })
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('facebook');
  });
});
