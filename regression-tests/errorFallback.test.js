const React = require('react');
const { render, screen } = require('@testing-library/react');

// ErrorFallback is a react-loadable wrapper around src/components/error (default export)
// which renders the BlueScreen component by default. We verify the fallback renders
// the expected ViewError copy.

describe('ErrorFallback (from src/routes.js)', () => {
  test('renders BlueScreen with default headings', () => {
    // Import the module similarly to routes.js but via CJS for Jest 22
    const mod = require('../src/components/error');
    // Default export is BlueScreen component (index.js exports default BlueScreen)
    const ErrorFallback = mod.default;

    render(React.createElement(ErrorFallback));

    // BlueScreen uses ViewError with heading and subheading below
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Sorry about the technical issues. Brian and Max have been notified of the problem and should resolve it soon.'
      )
    ).toBeInTheDocument();

    // It also renders a refresh button
    expect(
      screen.getByRole('button', { name: /refresh the page/i })
    ).toBeInTheDocument();
  });
});
