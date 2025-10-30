// Regression test for src/views/userSettings/components/downloadDataForm.js
const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the component via source path
const DownloadDataForm = require('src/views/userSettings/components/downloadDataForm')
  .default;

describe('DownloadDataForm regression', () => {
  const user = { id: 'u1', name: 'Test User' };

  it('does not render when user is missing', () => {
    const { container } = render(
      React.createElement(DownloadDataForm, { user: null })
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title, subtitle and download link', () => {
    render(React.createElement(DownloadDataForm, { user }));
    expect(screen.getByText('Download my data')).toBeInTheDocument();
    expect(
      screen.getByText('You can download your personal data at any time.')
    ).toBeInTheDocument();

    const link = screen.getAllByText('Download my data')[0].closest('a');
    expect(link).toBeTruthy();
    expect(link.hasAttribute('download')).toBe(true);
  });

  it('links to production endpoint in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    render(React.createElement(DownloadDataForm, { user }));
    const link = screen.getAllByText('Download my data')[0].closest('a');
    expect(link.getAttribute('href')).toBe('/api/user.json');
    process.env.NODE_ENV = originalEnv;
  });

  it('links to local endpoint in non-production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    render(React.createElement(DownloadDataForm, { user }));
    const link = screen.getAllByText('Download my data')[0].closest('a');
    expect(link.getAttribute('href')).toBe(
      'http://localhost:3001/api/user.json'
    );
    process.env.NODE_ENV = originalEnv;
  });
});
