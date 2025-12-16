// Regression test for shared/clients/draft-js/mentions-decorator
const { genKey, ContentBlock } = require('draft-js');
const mentionsDecorator =
  require('../shared/clients/draft-js/mentions-decorator').default ||
  require('../shared/clients/draft-js/mentions-decorator');

// Helper to create a ContentBlock similar to original tests
function createContentBlock(text) {
  return new ContentBlock({ depth: 0, text, key: genKey(), type: 'unstyled' });
}

function getMentions(text) {
  const block = createContentBlock(text);
  const mentions = [];
  mentionsDecorator.strategy(block, (start, end) => {
    mentions.push(text.substr(start, end - start));
  });
  return mentions;
}

test('finds single mention and its indices', () => {
  const text = '@mxstbr';
  const block = createContentBlock(text);
  const positions = [];
  mentionsDecorator.strategy(block, (start, end) => {
    positions.push({ start, end });
  });
  expect(positions[0].start).toBe(0);
  expect(positions[0].end).toBe(7);
});

test('handles mention in middle and end of sentence', () => {
  expect(getMentions('Hey @mxstbr how are you?')[0]).toBe('@mxstbr');
  expect(getMentions('Hey @mxstbr')[0]).toBe('@mxstbr');
});

test('handles multiple mentions', () => {
  const mentions = getMentions('Hey @mxstbr and @brian how are you');
  expect(mentions[0]).toBe('@mxstbr');
  expect(mentions[1]).toBe('@brian');
});

test('allows special characters and dots/underscores', () => {
  const text = "Hey I'm @john-doe, I also go by @john_doe or @john.doe";
  expect(getMentions(text)).toEqual(['@john-doe', '@john_doe', '@john.doe']);
});

test('edge: handles compound emojis and trailing punctuation excluded', () => {
  const emojiText =
    "Hey @grdp 👋🏻, I'm sure the @rauchg should be more than willing to answer that question. 😀";
  expect(getMentions(emojiText)[0]).toBe('@grdp');
  expect(getMentions(emojiText)[1]).toBe('@rauchg');

  const punct =
    "Hey guys it's @abc.123. where is @xyz? Any news from that guy?  @abc.123... over and out. cc: @some.other.person- @ceo; @hr,.";
  const m = getMentions(punct);
  expect(m[0]).toBe('@abc.123');
  expect(m[1]).toBe('@xyz');
  expect(m[2]).toBe('@abc.123');
  expect(m[3]).toBe('@some.other.person-');
  expect(m[4]).toBe('@ceo');
  expect(m[5]).toBe('@hr');
});
