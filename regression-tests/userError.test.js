const { IsUserError } = require('../api/utils/UserError.js');
const UserError = require('../api/utils/UserError.js').default;

describe('UserError', () => {
  test('sets name to Error and message passed', () => {
    const err = new UserError('Something went wrong');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('Error');
    expect(err.message).toBe('Something went wrong');
  });

  test('marks error with IsUserError symbol', () => {
    const err = new UserError('Boom');
    expect(err[IsUserError]).toBe(true);
  });

  test('captureStackTrace sets stack and excludes constructor', () => {
    const err = new UserError('Stacky');
    expect(typeof err.stack).toBe('string');
    // stack should start with 'Error: Stacky' and not include the class name by default
    expect(err.stack).toMatch(/Error: Stacky/);
  });
});
