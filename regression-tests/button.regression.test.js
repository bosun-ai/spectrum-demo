/**
 * Regression test for Button link wrapping behavior
 */
const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { Button } = require('../src/components/button');

describe('Button regression', () => {
  it('renders plain button when no href/to provided', () => {
    render(React.createElement(Button, null, 'Click Me'));
    const btn = screen.getByText('Click Me');
    expect(btn).toBeInTheDocument();
    // No anchor wrapper
    expect(btn.closest('a')).toBeNull();
  });

  it('wraps with anchor when href provided and sets rel when target not specified', () => {
    render(React.createElement(Button, { href: '/docs' }, 'Docs'));
    const link = screen.getByText('Docs').closest('a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('removes rel when target specified', () => {
    render(
      React.createElement(Button, { href: '/x', target: '_self' }, 'Self')
    );
    const link = screen.getByText('Self').closest('a');
    expect(link).not.toBeNull();
    expect(link.getAttribute('target')).toBe('_self');
    expect(link.getAttribute('rel')).toBe(null);
  });
});
