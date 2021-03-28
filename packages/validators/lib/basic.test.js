const E = require('@xroom.app/data-types/lib/either')
const ER = require('./errors')
const T = require('./basic')

// SECTION Tests

describe('string validator', () => {
  it('should return data if string passed', () => {
    expect(T.string('')).toMatchObject(E.right(''))
  })

  it('should return TypeError if not string passed', () => {
    expect(T.string(1)).toMatchObject(E.left([ER.typeError('string', 1)]))
  })
})

describe('number validator', () => {
  it('should return data if number passed', () => {
    expect(T.number(0)).toMatchObject(E.right(0))
  })

  it('should return TypeError if not number passed', () => {
    expect(T.number('')).toMatchObject(E.left([ER.typeError('number', '')]))
  })
})

describe('boolean validator', () => {
  it('should return data if boolean passed', () => {
    expect(T.boolean(true)).toMatchObject(E.right(true))
  })

  it('should return TypeError if not boolean passed', () => {
    expect(T.boolean(1)).toMatchObject(E.left([ER.typeError('boolean', 1)]))
  })
})

describe('nullVal validator', () => {
  it('should return data if null passed', () => {
    expect(T.nullVal(null)).toMatchObject(E.right(null))
  })

  it('should return TypeError if not null passed', () => {
    expect(T.nullVal(1)).toMatchObject(E.left([ER.typeError('null', 1)]))
  })
})

describe('undef validator', () => {
  it('should return data if undefined passed', () => {
    expect(T.undef(undefined)).toMatchObject(E.right(undefined))
  })

  it('should return TypeError if not null passed', () => {
    expect(T.undef(1)).toMatchObject(E.left([ER.typeError('undefined', 1)]))
  })
})

describe('literal validator', () => {
  it('should return data if the same literal passed', () => {
    expect(T.literal('123')('123')).toMatchObject(E.right('123'))
  })

  it('should return ConditionError if not same literal passed', () => {
    expect(T.literal('123')('')).toMatchObject(E.left([ER.conditionError('equals \'123\'', '')]))
    expect(T.literal(123)('')).toMatchObject(E.left([ER.conditionError('equals 123', '')]))
    expect(T.literal(true)('')).toMatchObject(E.left([ER.conditionError('equals true', '')]))
  })
})

describe('array validator', () => {
  it('should return data if valid array passed', () => {
    expect(T.array(T.number)([1, 2, 3])).toMatchObject(E.right([1, 2, 3]))
  })

  it('should return type error for non array type', () => {
    expect(T.array(T.number)(1)).toMatchObject(E.left([ER.typeError('Array', 1)]))
  })

  it('should return array container error if elements not match type', () => {
    expect(T.array(T.number)([1, 2, true])).toMatchObject(E.left([
      ER.containerError('Array', 1),
      ER.typeError('number', true)
    ]))
  })
})

describe('enumeration validator', () => {
  const boolEnum = { false: false, true: true }

  it('should return data if enumeration member passed', () => {
    expect(T.enumeration(boolEnum)(true)).toMatchObject(E.right(true))
  })

  it('should return condition error if non enum member passed', () => {
    expect(T.enumeration(boolEnum)(0)).toMatchObject(E.left([ER.conditionError('exists in [false,true]', 0)]))
  })
})

describe('union validator', () => {
  it('should return data if any of validators passed', () => {
    expect(T.union([T.number, T.string])(0)).toMatchObject(E.right(0))
    expect(T.union([T.number, T.string])('')).toMatchObject(E.right(''))
  })

  it('should return container error if no validators passed', () => {
    expect(T.union([T.number, T.string])(false)).toMatchObject(E.left([
      ER.containerError('Union', 2),
      ER.typeError('number', false),
      ER.typeError('string', false),
    ]))
  })

  it('should act as internal validator if tuple with 1 element passed', () => {
    expect(T.union([T.number])('')).toMatchObject(E.left([ER.typeError('number', '')]))
  })
})

describe('prop validator', () => {
  it('should return type error if data is not object', () => {
    expect(T.prop('required', 'foo', T.number)(0)).toMatchObject(E.left([ER.typeError('object', 0)]))
    expect(T.prop('optional', 'foo', T.number)(0)).toMatchObject(E.left([ER.typeError('object', 0)]))
  })

  it('should return data if object doesn\'t contain prop but validator is optional', () => {
    expect(T.prop('optional', 'foo', T.number)({ bar: 0 })).toMatchObject(E.right({ bar: 0 }))
  })

  it('should return error if object doesn\'t contain required prop', () => {
    expect(T.prop('required', 'foo', T.number)({ bar: 0 })).toMatchObject(E.left([
      ER.fieldError('foo'),
      ER.notFound
    ]))
  })

  it('should return error if prop exists, but not matches validator', () => {
    expect(T.prop('required', 'foo', T.number)({ foo: '' })).toMatchObject(E.left([
      ER.fieldError('foo'),
      ER.typeError('number', '')
    ]))

    expect(T.prop('optional', 'foo', T.number)({ foo: '' })).toMatchObject(E.left([
      ER.fieldError('foo'),
      ER.typeError('number', '')
    ]))
  })

  it('should return data if prop exists and matches validator', () => {
    expect(T.prop('required', 'foo', T.number)({ foo: 0 })).toMatchObject(E.right({ foo: 0 }))
    expect(T.prop('optional', 'foo', T.number)({ foo: 0 })).toMatchObject(E.right({ foo: 0 }))
  })
})

describe('type validator', () => {
  const foo = T.prop('required', 'a', T.number)
  const bar = T.prop('optional', 'b', T.string)

  const validator = T.type([foo, bar])

  it('should return data if each prop validator passed', () => {
    expect(validator({ a: 0, b: '' })).toMatchObject(E.right({ a: 0, b: '' }))

    expect(validator({ a: 0 })).toMatchObject(E.right({ a: 0 }))
  })

  it('should return TypeError if non object passed', () => {
    expect(validator(0)).toMatchObject(E.left([ER.typeError('object', 0)]))
    expect(validator(null)).toMatchObject(E.left([ER.typeError('object', null)]))
    expect(validator([0])).toMatchObject(E.left([ER.typeError('object', [0])]))
  })

  it('should return NotFoundError if one of fields doesn\'t exist', () => {
    expect(validator({ b: '' })).toMatchObject(E.left([
      ER.fieldError('a'),
      ER.notFound
    ]))
  })

  it('should return TypeError if field type doesn\'t match', () => {
    expect(validator({ a: 0, b: 1 })).toMatchObject(E.left([
      ER.fieldError('b'),
      ER.typeError('string', 1)
    ]))
  })
})
