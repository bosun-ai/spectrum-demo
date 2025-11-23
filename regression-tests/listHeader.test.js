const React = require('react');
const { render, screen } = require('@testing-library/react');
const styled = require('styled-components').default;

// Import the styled component under test
const { ListHeader } = require('../src/components/listItems/style.js');

// Provide a minimal ThemeProvider since styled-components reference theme
const { ThemeProvider } = require('styled-components');
const theme = require('../shared/theme').default || require('../shared/theme');

// Helper wrapper to render with theme
function renderWithTheme(ui, opts) {
  return render(React.createElement(ThemeProvider, { theme }, ui), opts);
}

test('ListHeader renders children', () => {
  renderWithTheme(
    React.createElement(
      ListHeader,
      null,
      React.createElement('span', { 'data-testid': 'child' }, 'Hello')
    )
  );
  expect(screen.getByTestId('child')).toBeInTheDocument();
});

test('ListHeader applies secondary margin-top when prop set', () => {
  const { container, rerender } = renderWithTheme(
    React.createElement(ListHeader, { 'data-testid': 'header' }, 'Content')
  );

  // Without secondary prop, margin-top should be 0
  const header = screen.getByTestId('header');
  // JSDOM computes styles only with getComputedStyle when style rules are injected
  const initialMargin = getComputedStyle(header).marginTop;
  expect(initialMargin === '0px' || initialMargin === '0').toBeTruthy();

  // With secondary, expect margin-top to be non-zero (24px)
  rerender(
    React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(
        ListHeader,
        { secondary: true, 'data-testid': 'header' },
        'Content'
      )
    )
  );
  const updatedMargin = getComputedStyle(screen.getByTestId('header'))
    .marginTop;
  // Allow either 24px or 24 depending on environment
  expect(updatedMargin === '24px' || updatedMargin === '24').toBeTruthy();
});
