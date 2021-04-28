const E = require('@xroom.app/data-types/lib/either')
const { same, literalToString } = require('./util')
const ER = require('./errors')

// SECTION Types

// MODULE Imports

/** @typedef {import('./errors').ValidateError} ValidateError */

/** @typedef {import('@xroom.app/data-types/lib/json').Json} Json */

/** @typedef {import('./basic-alg').BasicValidators<'either'>} BasicValidators$either */

/** @template T @typedef {import('@xroom.app/data-types/lib/option').Option<T>} Option */

/** @template E, R @typedef {import('@xroom.app/data-types/lib/either').Either<E, R>} Either */

// MODULE Declarations

/** @template T @typedef {Either<ReadonlyArray<ValidateError>, T>} ValidationResult$either */

// SECTION Interpreters

/** @type {BasicValidators$either['enumeration']} */
const enumeration = object => data => {
  const values = Object.values(object)

  for (const value of values) {
    if (same(data, value)) {
      return E.right(value)
    }
  }

  return E.left([ER.conditionError(`exists in [${values}]`, data)])
}

/** @type {BasicValidators$either['nullVal']} */
const nullVal = data => data === null ? E.right(null) : E.left([ER.typeError('null', data)])

/** @type {BasicValidators$either['boolean']} */
const boolean = data => typeof data === 'boolean' ? E.right(data) : E.left([ER.typeError('boolean', data)])

/** @type {BasicValidators$either['literal']} */
const literal = value => data => same(data, value) ? E.right(data) : E.left([ER.conditionError(`equals ${literalToString(value)}`, data)])

/** @type {BasicValidators$either['number']} */
const number = data => typeof data === 'number' ? E.right(data) : E.left([ER.typeError('number', data)])

/** @type {BasicValidators$either['string']} */
const string = data => typeof data === 'string' ? E.right(data) : E.left([ER.typeError('string', data)])

/** @type {BasicValidators$either['tuple']} */
// @ts-ignore temporary
const tuple = validators => data => {
  if (!Array.isArray(data)) {
    return E.left([ER.typeError('Tuple', data)])
  }

  const { length } = validators

  const lengthValidated = literal(length)(data.length)

  if (E.isLeft(lengthValidated)) {
    return E.left([
      ER.containerError('Tuple', 1),
      ER.fieldError('length'),
      ...lengthValidated.data
    ])
  }

  /** @type {Array<any>} */
  const result = []

  for (let i = 0; i < length; i += 1) {
    const validated = validators[i](data[i])

    if (E.isLeft(validated)) {
      return E.left([
        ER.containerError('Tuple', 1),
        ER.fieldError(String(i)),
        ...validated.data,
      ])
    }

    result.push(validated.data)
  }

  return E.right(result)
}

/** @type {BasicValidators$either['array']} */
const array = validator => data => {
  if (!Array.isArray(data)) {
    return E.left([ER.typeError('Array', data)])
  }

  /** @type {Array<any>} */
  const result = []

  for (const elem of data) {
    const validated = validator(elem)

    if (E.isLeft(validated)) {
      return E.left([
        ER.containerError('Array', 1),
        ...validated.data,
      ])
    }

    result.push(validated.data)
  }

  return E.right(result)
}

/** @type {BasicValidators$either['union']} */
const union = validators => data => {
  /** @type {Array<ReadonlyArray<ValidateError>>} */
  const results = []

  for (const validator of validators) {
    const validated = validator(data)

    if (E.isRight(validated)) {
      return E.right(validated.data)
    }

    results.push(validated.data)
  }

  if (results.length === 1) {
    return E.left(results.flat())
  }

  return E.left([ER.containerError('Union', results.length), ...results.flat()])
}

/** @type {BasicValidators$either['undef']} */
const undef = data => data === undefined ? E.right(undefined) : E.left([ER.typeError('undefined', data)])

/** @type {BasicValidators$either['prop']} */
// @ts-ignore temporary
const prop = (type, key, validator) => data => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return E.left([ER.typeError('Object', data)])
  }

  /** @type {Record<string, any>} */
  const record = data

  /** @type {Option<Json>} */
  const p = record[key]

  if (!(key in record)) {
    if (type === 'optional') {
      return E.right({})
    }

    return E.left([
      ER.containerError('Object', 1),
      ER.fieldError(key),
      ER.notFound
    ])
  }

  const validated = validator(p)

  if (E.isLeft(validated)) {
    return E.left([
      ER.containerError('Object', 1),
      ER.fieldError(key),
      ...validated.data
    ])
  }

  return E.right({ [key]: validated.data })
}

/** @type {BasicValidators$either['type']} */
const type = props => data => {
  /** @type {Array<Record<string, any>>}} */
  const result = []

  for (const p of props) {
    const res = p(data)

    if (E.isLeft(res)) {
      return res
    }

    result.push(res.data)
  }

  return E.right(Object.assign({}, ...result))
}

/** @type {BasicValidators$either} */
const basicValidators$either = {
  enumeration,
  nullVal,
  boolean,
  literal,
  number,
  string,
  tuple,
  array,
  union,
  undef,
  prop,
  type,
}

// SECTION Exports

module.exports = { basicValidators$either }
