// Regression test for Pages component routing/rendering behavior
// Uses React.createElement; Testing Library v8 APIs

/* eslint-env jest */

const React = require('react');
const { render, cleanup } = require('@testing-library/react');

// Component under test
const Pages = require('../src/views/pages/index.js').default;

// Mock child components to observe rendering
jest.mock('../src/views/pages/terms', () => ({
  __esModule: true,
  default: function TermsMock() {
    return React.createElement('div', { 'data-testid': 'terms' }, 'Terms');
  },
}));

jest.mock('../src/views/pages/privacy', () => ({
  __esModule: true,
  default: function PrivacyMock() {
    return React.createElement('div', { 'data-testid': 'privacy' }, 'Privacy');
  },
}));

// Mock Nav to assert props derived from path
jest.mock('../src/views/pages/components/nav', () => ({
  __esModule: true,
  default: function NavMock(props) {
    return React.createElement(
      'div',
      {
        'data-testid': 'nav',
        'data-dark': props.dark,
        'data-location': props.location,
      },
      'Nav'
    );
  },
}));

describe('Pages component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders Terms when match.path is /terms', () => {
    const { getByTestId, queryByTestId } = render(
      React.createElement(Pages, { match: { path: '/terms' } })
    );

    expect(getByTestId('terms')).toBeTruthy();
    expect(queryByTestId('privacy')).toBeNull();

    // Nav receives location without leading slash and dark is undefined
    const nav = getByTestId('nav');
    expect(nav.getAttribute('data-location')).toBe('terms');
    expect(nav.getAttribute('data-dark')).toBeNull();
  });

  it('renders Privacy when match.path is /privacy.html', () => {
    const { getByTestId, queryByTestId } = render(
      React.createElement(Pages, { match: { path: '/privacy.html' } })
    );

    expect(getByTestId('privacy')).toBeTruthy();
    expect(queryByTestId('terms')).toBeNull();

    const nav = getByTestId('nav');
    expect(nav.getAttribute('data-location')).toBe('privacy.html');
    expect(nav.getAttribute('data-dark')).toBeNull();
  });

  it('sets dark for root path and passes correct location', () => {
    const { getByTestId } = render(
      React.createElement(Pages, { match: { path: '/' } })
    );
    const nav = getByTestId('nav');
    // dark prop is set to string 'true' per component
    expect(nav.getAttribute('data-dark')).toBe('true');
    expect(nav.getAttribute('data-location')).toBe('');
  });

  it('sets dark for /about and does not render Terms/Privacy', () => {
    const { getByTestId, queryByTestId } = render(
      React.createElement(Pages, { match: { path: '/about' } })
    );
    const nav = getByTestId('nav');
    expect(nav.getAttribute('data-dark')).toBe('true');
    expect(nav.getAttribute('data-location')).toBe('about');

    expect(queryByTestId('terms')).toBeNull();
    expect(queryByTestId('privacy')).toBeNull();
  });
});
