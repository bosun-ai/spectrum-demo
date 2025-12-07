const React = require('react');
const { render, screen } = require('@testing-library/react');
jest.mock('../src/components/layout', () => {
  const React = require('react');
  return {
    ViewGrid: props =>
      React.createElement(
        'div',
        Object.assign({ 'data-testid': 'explore-page' }, props)
      ),
  };
});
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));
jest.mock('react-redux', () => ({ connect: () => C => C }));
jest.mock('react-helmet-async', () => ({ Helmet: props => null }));

// Render the real Routes component and navigate to /explore
describe('Explore Route', () => {
  test('renders Explore view at /explore', async () => {
    const Explore = require('../src/views/explore').default;
    render(React.createElement(Explore));
    const el = await screen.findByTestId('explore-page');
    expect(el).toBeInTheDocument();
  });
});
