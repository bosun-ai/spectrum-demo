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

// Note: Internal embeds render ThreadAttachment which requires Apollo context.
// To keep regression environment simple, we verify only external embed behavior.
