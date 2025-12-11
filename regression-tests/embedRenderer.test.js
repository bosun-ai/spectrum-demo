const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the Embed via the renderer that exposes it through entities.embed
const {
  createRenderer,
} = require('../shared/clients/draft-js/renderer/index.js');

// Helper to invoke the renderer entity for embed
function renderEmbed(data, key = 'k1') {
  const renderer = createRenderer({ headings: false });
  const element = renderer.entities.embed([], data, { key });
  // Render inside a container to mount the React element
  return render(React.createElement('div', null, element));
}

test('renders ExternalEmbed with iframe src', () => {
  const src = 'https://example.com/embed';
  renderEmbed({ type: 'external', src, width: '100%', height: 200 });
  const iframe = screen.getByTitle(`iframe-${src}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe.tagName.toLowerCase()).toBe('iframe');
  expect(iframe).toHaveAttribute('src', src);
  expect(iframe).toHaveAttribute('width', '100%');
  expect(iframe).toHaveAttribute('height', '200');
});

test('renders ExternalEmbed with aspectRatio using EmbedComponent', () => {
  const src = 'https://example.com/video';
  // aspectRatio will cause EmbedComponent to be used (styled iframe)
  renderEmbed({ type: 'external', src, aspectRatio: '16:9', height: 300 });
  const iframe = screen.getByTitle(`iframe-${src}`);
  expect(iframe).toBeInTheDocument();
  expect(iframe.tagName.toLowerCase()).toBe('iframe');
  expect(iframe).toHaveAttribute('src', src);
});

test('renders InternalEmbed thread via ThreadAttachment', () => {
  // Internal embeds render ThreadAttachment which contains a link button; we assert it mounts
  renderEmbed({ type: 'internal', entity: 'thread', id: 'thread-id-123' });
  // ThreadAttachment renders an element with role="button" to open thread; verify it's present
  const buttons = screen.queryAllByRole('button');
  expect(buttons.length).toBeGreaterThan(0);
});
