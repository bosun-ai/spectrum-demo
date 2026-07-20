const { Map } = require('immutable');

const payload = JSON.parse('{"__proto__":{"polluted":true}}');

const expectSafeObject = result => {
  expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
  expect(result.polluted).toBeUndefined();
};

describe('Immutable prototype-key handling', () => {
  it('does not expose prototype keys through object conversions', () => {
    expectSafeObject(Map({ safe: true }).merge(payload).toObject());
    expectSafeObject(
      Map({ safe: true }).set('__proto__', payload.__proto__).toObject()
    );
    expectSafeObject(Map({ safe: true }).merge(payload).toJS());
    expectSafeObject(Map({ safe: true }).set('__proto__', payload.__proto__).toJS());
  });
});
