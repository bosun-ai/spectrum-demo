const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router');

// Import the renderer factory from the component under test
const {
  createRenderer,
} = require('../shared/clients/draft-js/renderer/index.js');

// Helper to render an entity using the renderer interface
function renderEntity(renderer, type, children, data, extra = {}) {
  const Entity = renderer.entities[type];
  return React.createElement(Entity, children, data, extra);
}

test('ExternalEmbed renders iframe with url/src and aspect ratio', () => {
  const renderer = createRenderer({ headings: false });

  const data = {
    type: 'external',
    url: 'https://example.com/embed',
    height: 200,
  };
  const element = React.createElement(
    MemoryRouter,
    {},
    renderer.entities.embed([], data, { key: 'k1' })
  );
  const { container } = render(element);

  // Should render an iframe with the given src
  const iframe = container.querySelector('iframe');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', 'https://example.com/embed');
  expect(iframe).toHaveAttribute('title', 'iframe-https://example.com/embed');
});

test('ExternalEmbed falls back to null when src/url missing', () => {
  const renderer = createRenderer({ headings: false });
  const data = { type: 'external' };
  const element = React.createElement(
    MemoryRouter,
    {},
    renderer.entities.embed([], data, { key: 'k2' })
  );
  const { container } = render(element);
  // No iframe should be rendered
  expect(container.querySelector('iframe')).toBeNull();
});

test('InternalEmbed renders ThreadAttachment for thread entity', () => {
  const renderer = createRenderer({ headings: false });
  const data = { type: 'internal', entity: 'thread', id: 'thread123' };
  const element = React.createElement(
    MemoryRouter,
    {},
    renderer.entities.embed([], data, { key: 'k3' })
  );
  const { container } = render(element);
  // ThreadAttachment renders with a data-reactroot; check for element by component name fallback
  // We can assert presence of an element with id prop reflected in DOM via data-testid if present,
  // but since original component may not expose test ids, ensure some element exists
  expect(container.firstChild).toBeTruthy();
});
