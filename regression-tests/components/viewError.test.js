// Regression test for ViewError rendering and refresh button behavior
const React = require('react');
const { render, fireEvent } = require('react-testing-library');

// Component under test
const ViewError = require('../../src/components/viewError').default;

describe('ViewError regression', () => {
  test('renders heading, subheading and refresh button', () => {
    const { getByText, getByLabelText } = render(
      React.createElement(ViewError, {
        emoji: '💥',
        heading: 'Oops',
        subheading: 'Please try again',
        refresh: true,
      })
    );

    // Emoji rendered with accessible label
    expect(getByLabelText('Emoji').textContent).toBe('💥');
    // Headings rendered
    expect(getByText('Oops')).toBeTruthy();
    expect(getByText('Please try again')).toBeTruthy();
    // Refresh button exists and triggers reload
    const btn = getByText('Refresh the page');

    const originalReload = window.location.reload;
    let called = false;
    window.location.reload = () => {
      called = true;
    };

    fireEvent.click(btn);

    expect(called).toBe(true);

    // restore
    window.location.reload = originalReload;
  });
});
