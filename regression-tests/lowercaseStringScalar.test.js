// Regression test for LowercaseString GraphQL custom scalar
// Ensures parseValue, serialize, and parseLiteral lower-case strings

const { Kind } = require('graphql/language');
const LowercaseString = require('../api/types/custom-scalars/LowercaseString')
  .default;

describe('LowercaseString scalar', () => {
  test('parseValue lowercases input strings', () => {
    expect(LowercaseString.parseValue('HelloWorld')).toBe('helloworld');
    expect(LowercaseString.parseValue('MiXeD Case 123')).toBe('mixed case 123');
    expect(LowercaseString.parseValue('ALREADY LOWER')).toBe('already lower');
  });

  test('serialize lowercases output strings', () => {
    expect(LowercaseString.serialize('HelloWorld')).toBe('helloworld');
    expect(LowercaseString.serialize('MiXeD Case 123')).toBe('mixed case 123');
    expect(LowercaseString.serialize('already lower')).toBe('already lower');
  });

  test('parseLiteral lowercases when AST is a STRING', () => {
    const ast = { kind: Kind.STRING, value: 'HelloWorld' };
    expect(LowercaseString.parseLiteral(ast)).toBe('helloworld');
  });

  test('parseLiteral returns null for non-string AST', () => {
    const astInt = { kind: Kind.INT, value: '123' };
    const astBool = { kind: Kind.BOOLEAN, value: true };
    expect(LowercaseString.parseLiteral(astInt)).toBeNull();
    expect(LowercaseString.parseLiteral(astBool)).toBeNull();
  });
});
