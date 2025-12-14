// Jest setup for regression tests
// - Extends Jest with @testing-library/jest-dom matchers
// - Ensures fetch is available in Node via cross-fetch

// Ensure fetch is defined in Node test environment
require('cross-fetch/polyfill');

// Extend Jest with DOM matchers
require('@testing-library/jest-dom/extend-expect');
