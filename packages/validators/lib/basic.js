const { mapFind, prepend, same, literalToString } = require('./util')
const E = require('@xroom.app/data-types/lib/either')
const ER = require('./errors')

// SECTION Types

// MODULE Imports

/** @template T @typedef {import('./util').Tuple<T>} Tuple */

/** @typedef {import('./errors').ValidateError} ValidateError */

/** @template L, R @typedef {import('@xroom.app/data-types/lib/either').Either<L, R>} Either */

// MODULE Declarations

/** @typedef {'optional' | 'required'} PropType */

/** @template T @typedef {ValidatorExtension<unknown, T>} Validator */

/** @template T @typedef {Either<ReadonlyArray<ValidateError>, T>} ValidationResult */

/** @template T1, T2 @typedef {(data: T1) => ValidationResult<T2>} ValidatorExtension */

/**
 * @template {PropType} P
 * @template {string} K
 * @template T
 *
 *
 * @typedef {(
 *   P extends 'optional'
 *     ? { [KEY in K]?: T }
 *     : { [KEY in K]: T }
 * )} PropToObject
 */

/** @template T @typedef {T extends Function ? T : { [K in keyof T]: T[K] } & unknown} Compute */

/** @template {Validator<any>} V @typedef {V extends Validator<infer T> ? T : never} ValidatorType */

/** @template {Tuple<Validator<Record<string, any>>>} T @typedef {UnionToIntersection<ValidatorType<T[number]>>} PropsToObject */

/** @template U @typedef {Compute<(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never>} UnionToIntersection */

// SECTION Library

/** @type {Validator<string>} */
const string = data => typeof data === 'string' ? E.right(data) : E.left([ER.typeError('string', data)])

/** @type {Validator<number>} */
const number = data => typeof data === 'number' ? E.right(data) : E.left([ER.typeError('number', data)])

/** @type {Validator<boolean>} */
const boolean = data => typeof data === 'boolean' ? E.right(data) : E.left([ER.typeError('boolean', data)])

/** @type {Validator<null>} */
const nullVal = data => data === null ? E.right(null) : E.left([ER.typeError('null', data)])

/** @type {Validator<undefined>} */
const undef = data => data === undefined ? E.right(undefined) : E.left([ER.typeError('undefined', data)])

/** @type {<T extends string | boolean | number>(value: T) => Validator<T>} */
const literal = value => data => same(data, value) ? E.right(data) : E.left([ER.conditionError(`equals ${literalToString(value)}`, data)])

/** @type {<T>(validator: Validator<T>) => Validator<ReadonlyArray<T>>} */
const array = validator => data => {
  if (!Array.isArray(data)) {
    return E.left([ER.typeError('Array', data)])
  }

  const left = mapFind(validator, E.isLeft)(data)

  if (left === undefined) {
    return E.right(data)
  }

  return E.mapLeft(left, prepend(ER.containerError('Array', 1)))
}

/** @type {<T extends string | boolean | number>(object: Record<string, T>) => Validator<T>} */
const enumeration = object => data => {
  const values = Object.values(object)

  const result = values.find(val => same(data, val))

  if (result !== undefined) { return E.right(result) }

  return E.left([ER.conditionError(`exists in [${values}]`, data)])
}

/** @type {<T extends Tuple<Validator<any>>>(validators: T) => Validator<ValidatorType<T[number]>>} */
const union = validators => data => {
  /** @type {Array<ReadonlyArray<ValidateError>>} */
  const results = []

  for (const validator of validators) {
    const validated = validator(data)

    if (E.isRight(validated)) {
      /** @type {any} */
      const result = data

      return E.right(result)
    }

    results.push(validated.data)
  }

  if (results.length === 1) {
    return E.left(results.flat())
  }

  return E.left([ER.containerError('Union', results.length), ...results.flat()])
}

/** @type {<P extends PropType, K extends string, T>(type: P, key: K, validator: Validator<T>) => Validator<PropToObject<P, K, T>>} */
// @ts-ignore necessary
const prop = (type, key, validator) => data => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return E.left([ER.typeError('object', data)])
  }

  /** @type {Record<string, any>} */
  const record = data

  /** @type {unknown} */
  const p = record[key]

  if (!(key in record)) {
    if (type === 'optional') {
      return E.right(data)
    }

    return E.left([
      ER.fieldError(key),
      ER.notFound
    ])
  }

  const validated = validator(p)

  if (E.isLeft(validated)) {
    return E.left([
      ER.fieldError(key),
      ...validated.data
    ])
  }

  return E.right({ [key]: validated.data })
}

/** @type {<P extends Tuple<Validator<Record<string, any>>>>(props: P) => Validator<PropsToObject<P>>} */
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

// SECTION Exports

module.exports = {
  enumeration,
  boolean,
  nullVal,
  literal,
  number,
  string,
  undef,
  union,
  array,
  prop,
  type,
}
