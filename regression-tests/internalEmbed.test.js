const React = require('react');
const { render, screen } = require('@testing-library/react');

// Import the renderer which contains InternalEmbed
const {
  createRenderer,
} = require('../shared/clients/draft-js/renderer/index.js');

// Mock ThreadAttachment to avoid GraphQL/data dependencies and assert render
jest.mock(
  '../src/components/message/threadAttachment',
  () =>
    function MockThreadAttachment(props) {
      return require('react').createElement('div', {
        'data-testid': 'thread-attachment',
        id: props.id,
      });
    }
);

// Mock style components used by renderer to avoid styled-components requirements
jest.mock('../src/components/message/style', () => ({
  Line: props => require('react').createElement('div', props),
  Paragraph: props => require('react').createElement('p', props),
  BlockQuote: props => require('react').createElement('blockquote', props),
}));

jest.mock('../src/components/rich-text-editor/style', () => ({
  AspectRatio: props => require('react').createElement('div', props),
  EmbedContainer: props => require('react').createElement('div', props),
  EmbedComponent: props => require('react').createElement('iframe', props),
}));

// Mock react-router-dom Link to a simple anchor to avoid needing a router
jest.mock('react-router-dom', () => ({
  Link: props => require('react').createElement('a', props),
}));

describe('InternalEmbed', () => {
  test('renders ThreadAttachment when entity is thread', () => {
    const renderer = createRenderer({ headings: false });
    // renderer.entities.embed is a function (children, data, {key}) => ReactElement
    const renderEmbed = renderer.entities.embed;
    const data = { type: 'internal', entity: 'thread', id: 'thread-123' };
    const element = renderEmbed([null], data, { key: 'k1' });

    render(element);

    const attachment = screen.getByTestId('thread-attachment');
    expect(attachment).toBeInTheDocument();
    // ensure id is passed through
    expect(attachment.getAttribute('id')).toBe('thread-123');
  });

  test('returns null for non-thread internal entity', () => {
    const renderer = createRenderer({ headings: false });
    const renderEmbed = renderer.entities.embed;
    const data = { type: 'internal', entity: 'message', id: 'msg-1' };
    const element = renderEmbed([null], data, { key: 'k2' });

    const { container } = render(element);
    // Should render nothing
    expect(container).toBeEmptyDOMElement();
  });
});
