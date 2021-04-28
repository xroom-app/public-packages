const T = require('./basic-result').basicValidators$result
const R = require('@xroom.app/data-types/lib/result')

// SECTION Constants

/** @type {import('./basic-alg').Validator<'result', number>} */
const stringToLength = data => typeof data === 'string' ? R.ok(data.length) : R.err

// SECTION Tests

describe('string validator', () => {
  it('should return ok result if string passed', () => {
    expect(T.string('')).toMatchObject(R.ok(''))
  })

  it('should return err result if not string passed', () => {
    expect(T.string(1)).toMatchObject(R.err)
  })
})

describe('number validator', () => {
  it('should return ok result if number passed', () => {
    expect(T.number(0)).toMatchObject(R.ok(0))
  })

  it('should return err result if not number passed', () => {
    expect(T.number('')).toMatchObject(R.err)
  })
})

describe('boolean validator', () => {
  it('should return ok result if boolean passed', () => {
    expect(T.boolean(true)).toMatchObject(R.ok(true))
  })

  it('should return err result if not boolean passed', () => {
    expect(T.boolean(1)).toMatchObject(R.err)
  })
})

describe('nullVal validator', () => {
  it('should return ok result if null passed', () => {
    expect(T.nullVal(null)).toMatchObject(R.ok(null))
  })

  it('should return err result if not null passed', () => {
    expect(T.nullVal(1)).toMatchObject(R.err)
  })
})

describe('undef validator', () => {
  it('should return ok result if undefined passed', () => {
    expect(T.undef(undefined)).toMatchObject(R.ok(undefined))
  })

  it('should return err result if not null passed', () => {
    expect(T.undef(1)).toMatchObject(R.err)
  })
})

describe('literal validator', () => {
  it('should return ok result if the same literal passed', () => {
    expect(T.literal('123')('123')).toMatchObject(R.ok('123'))
  })

  it('should return err result if not same literal passed', () => {
    expect(T.literal('123')('')).toMatchObject(R.err)
    expect(T.literal(123)('')).toMatchObject(R.err)
    expect(T.literal(true)('')).toMatchObject(R.err)
  })
})

describe('array validator', () => {
  it('should return ok result if valid array passed', () => {
    expect(T.array(T.number)([1, 2, 3])).toMatchObject(R.ok([1, 2, 3]))
  })

  it('should return err result for non array type', () => {
    expect(T.array(T.number)(1)).toMatchObject(R.err)
  })

  it('should return err result if elements not match type', () => {
    expect(T.array(T.number)([1, 2, true])).toMatchObject(R.err)
  })

  it('should return ok result array with elements mapped by validator passed', () => {
    expect(T.array(stringToLength)(['0', '01', '012'])).toMatchObject(R.ok([1, 2, 3]))
  })

  it('should return err result if element doesn\'t match mapping validator passed', () => {
    expect(T.array(stringToLength)(['0', '01', 3])).toMatchObject(R.err)
  })
})

describe('tuple validator', () => {
  it('should return ok result if valid tuple passed', () => {
    expect(T.tuple([T.number, T.string])([0, ''])).toMatchObject(R.ok([0, '']))
  })

  it('should return err result for non tuple type', () => {
    expect(T.tuple([T.number])(1)).toMatchObject(R.err)
  })

  it('should return err result if elements not match types', () => {
    expect(T.tuple([T.number, T.string])([1, 2])).toMatchObject(R.err)

    expect(T.tuple([T.number, T.string])(['', 2])).toMatchObject(R.err)

    expect(T.tuple([T.number, T.string])(['', ''])).toMatchObject(R.err)
  })

  it('should return err result if length doesn\'t match', () => {
    expect(T.tuple([T.number, T.string])([1, 2, 3])).toMatchObject(R.err)
  })

  it('should return ok result tuple with elements mapped by validators passed', () => {
    expect(T.tuple([stringToLength, stringToLength, stringToLength])(['0', '01', '012'])).toMatchObject(R.ok([1, 2, 3]))
  })
})

describe('enumeration validator', () => {
  const boolEnum = { false: false, true: true }

  it('should return ok result if enumeration member passed', () => {
    expect(T.enumeration(boolEnum)(true)).toMatchObject(R.ok(true))
  })

  it('should return err result if non enum member passed', () => {
    expect(T.enumeration(boolEnum)(0)).toMatchObject(R.err)
  })
})

describe('union validator', () => {
  it('should return ok result if any of validators passed', () => {
    expect(T.union([T.number, T.string])(0)).toMatchObject(R.ok(0))
    expect(T.union([T.number, T.string])('')).toMatchObject(R.ok(''))
  })

  it('should return err result if no validators passed', () => {
    expect(T.union([T.number, T.string])(false)).toMatchObject(R.err)
  })
})

describe('prop validator', () => {
  it('should return err result if data is not object', () => {
    expect(T.prop('required', 'foo', T.number)(0)).toMatchObject(R.err)
    expect(T.prop('optional', 'foo', T.number)(0)).toMatchObject(R.err)
  })

  it('should return ok result if object doesn\'t contain prop but validator is optional', () => {
    expect(T.prop('optional', 'foo', T.number)({ bar: 0 })).toMatchObject(R.ok({}))
  })

  it('should return err result if object doesn\'t contain required prop', () => {
    expect(T.prop('required', 'foo', T.number)({ bar: 0 })).toMatchObject(R.err)
  })

  it('should return err result if prop exists, but not matches validator', () => {
    expect(T.prop('required', 'foo', T.number)({ foo: '' })).toMatchObject(R.err)

    expect(T.prop('optional', 'foo', T.number)({ foo: '' })).toMatchObject(R.err)
  })

  it('should return ok result if prop exists and matches validator', () => {
    expect(T.prop('required', 'foo', T.number)({ foo: 0 })).toMatchObject(R.ok({ foo: 0 }))
    expect(T.prop('optional', 'foo', T.number)({ foo: 0 })).toMatchObject(R.ok({ foo: 0 }))
  })
})

describe('type validator', () => {
  const foo = T.prop('required', 'a', T.number)
  const bar = T.prop('optional', 'b', T.string)

  const validator = T.type([foo, bar])

  it('should return ok result if each prop validator passed', () => {
    expect(validator({ a: 0, b: '' })).toMatchObject(R.ok({ a: 0, b: '' }))

    expect(validator({ a: 0 })).toMatchObject(R.ok({ a: 0 }))
  })

  it('should return err result if non object passed', () => {
    expect(validator(0)).toMatchObject(R.err)
    expect(validator(null)).toMatchObject(R.err)
    expect(validator([0])).toMatchObject(R.err)
  })

  it('should return err result if one of fields doesn\'t exist', () => {
    expect(validator({ b: '' })).toMatchObject(R.err)
  })

  it('should return err result if field type doesn\'t match', () => {
    expect(validator({ a: 0, b: 1 })).toMatchObject(R.err)
  })
})
