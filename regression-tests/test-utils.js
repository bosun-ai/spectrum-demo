const React = require('react');
const { render } = require('@testing-library/react');
const { ThemeProvider } = require('styled-components');
const { MemoryRouter } = require('react-router');

// Minimal theme covering social provider colors used by LoginButtonSet styles
const theme = {
  social: {
    twitter: { default: '#1DA1F2' },
    facebook: { default: '#1877F2' },
    google: { default: '#DB4437' },
    github: { default: '#24292E' },
  },
};

function renderWithThemeAndRouter(ui, { route = '/' } = {}) {
  return render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(ThemeProvider, { theme }, ui)
    )
  );
}

module.exports = { renderWithThemeAndRouter, theme };
