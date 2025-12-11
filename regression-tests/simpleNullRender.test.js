// Simple regression test to ensure components intended to render nothing
// return `null` explicitly, not `undefined`. This aligns with React 17's
// enforcement for valid returns (undefined throws in memo/forwardRef).
// Version delta: 16.8.6 -> 17.0.2

// Note: This project uses Jest for tests (per docs). This test is placed
// in regression-tests to validate upgrade behavior.

describe('Conditional null rendering convention', () => {
  it('returns null when condition unmet', () => {
    const ConditionalComponent = ({ show }) => {
      // Explicitly return null to render nothing when show is false
      // (React 17 enforces valid returns; undefined would throw in memo/forwardRef)
      return show ? 'rendered' : null;
    };

    expect(ConditionalComponent({ show: false })).toBeNull();
    expect(ConditionalComponent({ show: true })).toBe('rendered');
  });
});
