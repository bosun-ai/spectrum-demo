// Setup for regression tests
// Extend expect with jest-dom matchers
import '@testing-library/jest-dom/extend-expect';

// Polyfill fetch in Node using cross-fetch
import fetch from 'cross-fetch';
if (typeof global.fetch === 'undefined') {
  // eslint-disable-next-line no-undef
  global.fetch = fetch;
}
