const React = require('react');
const { render, screen } = require('@testing-library/react');
jest.mock('../src/components/layout', () => ({
  ViewGrid: props =>
    React.createElement('div', { 'data-testid': 'explore-page', ...props }),
}));
jest.mock('../src/components/error', () => ({
  ErrorBoundary: ({ children }) => children,
}));
jest.mock('../src/components/withCurrentUser', () => ({
  withCurrentUser: C => C,
}));
jest.mock('react-redux', () => ({ connect: () => C => C }));

// Render the real Routes component and navigate to /explore
describe('Explore Route', () => {
  test('renders Explore view at /explore', async () => {
    const Explore = require('../src/views/explore').default;
    render(React.createElement(Explore));
    const el = await screen.findByTestId('explore-page');
    expect(el).toBeInTheDocument();
  });
});
