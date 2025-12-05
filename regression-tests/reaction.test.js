// Regression test for src/components/reaction/index.js
const React = require('react');
const { render } = require('@testing-library/react');

// Use CommonJS require to align with existing regression tests runtime
const Reaction = require('../src/components/reaction/index.js').default;

describe('Reaction component', () => {
  it('passes me, hasReacted, and count to render prop', () => {
    const message = {
      reactions: { hasReacted: true, count: 3 },
    };

    const renderSpy = jest.fn(() => null);

    render(
      React.createElement(Reaction, {
        dispatch: () => {},
        currentUser: { id: 'u' },
        me: true,
        message,
        render: renderSpy,
      })
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);
    const args = renderSpy.mock.calls[0][0];
    expect(args).toEqual({ me: true, hasReacted: true, count: 3 });
  });

  it('handles false reaction state and zero count', () => {
    const message = {
      reactions: { hasReacted: false, count: 0 },
    };

    const renderSpy = jest.fn(() => null);

    render(
      React.createElement(Reaction, {
        dispatch: () => {},
        me: false,
        message,
        render: renderSpy,
      })
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);
    const args = renderSpy.mock.calls[0][0];
    expect(args).toEqual({ me: false, hasReacted: false, count: 0 });
  });
});
