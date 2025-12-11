const React = require('react');
const { render, screen } = require('@testing-library/react');

// Mock style modules with aliased paths used by the renderer early
jest.mock('../src/components/message/style', () => {
  const ReactLocal = require('react');
  return {
    Line: props => ReactLocal.createElement('pre', props),
    Paragraph: props => ReactLocal.createElement('p', props),
    BlockQuote: props => ReactLocal.createElement('blockquote', props),
  };
});

jest.mock('../src/components/rich-text-editor/style', () => {
  const ReactLocal = require('react');
  return {
    AspectRatio: props => ReactLocal.createElement('div', props),
    EmbedContainer: props => ReactLocal.createElement('div', props),
    EmbedComponent: props => ReactLocal.createElement('iframe', props),
  };
});

// Component under test renders an InternalEmbed -> ThreadAttachment
const { createRenderer } = require('../shared/clients/draft-js/renderer');

// Mock ThreadAttachment to avoid GraphQL/HOC wiring; assert it's rendered with id
jest.mock('../src/components/message/threadAttachment', () => {
  const ReactLocal = require('react');
  return function ThreadAttachmentMock(props) {
    return ReactLocal.createElement('div', {
      'data-testid': 'thread-attachment',
      'data-id': props.id,
    });
  };
});

// Mock style modules with aliased paths used by the renderer
jest.mock('../src/components/message/style', () => {
  const ReactLocal = require('react');
  return {
    Line: props => ReactLocal.createElement('pre', props),
    Paragraph: props => ReactLocal.createElement('p', props),
    BlockQuote: props => ReactLocal.createElement('blockquote', props),
  };
});

jest.mock('../src/components/rich-text-editor/style', () => {
  const ReactLocal = require('react');
  return {
    AspectRatio: props => ReactLocal.createElement('div', props),
    EmbedContainer: props => ReactLocal.createElement('div', props),
    EmbedComponent: props => ReactLocal.createElement('iframe', props),
  };
});

test('InternalEmbed returns ThreadAttachment for entity "thread"', () => {
  const renderer = createRenderer({ headings: false });
  const data = { type: 'internal', entity: 'thread', id: 'abc123' };

  // entities.embed returns React element; render it
  const element = renderer.entities.embed([], data, { key: 'k1' });
  render(element);

  const attachment = screen.getByTestId('thread-attachment');
  expect(attachment).toBeInTheDocument();
  expect(attachment.getAttribute('data-id')).toBe('abc123');
});

test('InternalEmbed returns null for non-thread entity', () => {
  const renderer = createRenderer({ headings: false });
  const data = { type: 'internal', entity: 'message', id: 'zzz' };

  const element = renderer.entities.embed([], data, { key: 'k2' });
  // When element is null, rendering should not throw and nothing appears
  render(React.createElement('div', null, element));

  const results = screen.queryByTestId('thread-attachment');
  expect(results).toBeNull();
});
