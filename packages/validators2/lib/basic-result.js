const R = require('@xroom.app/data-types/lib/result')
const { same } = require('./util')

// SECTION Types

// MODULE Imports

/** @typedef {import('./basic-alg').BasicValidators<'result'>} BasicValidators$result */

// SECTION Interpreters

/** @type {BasicValidators$result['enumeration']} */
const enumeration = object => data => {
  const values = Object.values(object)

  for (const value of values) {
    if (same(data, value)) {
      return R.ok(value)
    }
  }

  return R.err
}

/** @type {BasicValidators$result['nullVal']} */
const nullVal = data => data === null ? R.ok(null) : R.err

/** @type {BasicValidators$result['boolean']} */
const boolean = data => typeof data === 'boolean' ? R.ok(data) : R.err

/** @type {BasicValidators$result['literal']} */
const literal = value => data => same(data, value) ? R.ok(data) : R.err

/** @type {BasicValidators$result['number']} */
const number = data => typeof data === 'number' ? R.ok(data) : R.err

/** @type {BasicValidators$result['string']} */
const string = data => typeof data === 'string' ? R.ok(data) : R.err

/** @type {BasicValidators$result['tuple']} */
// @ts-ignore temporary
const tuple = validators => data => {
  if (!Array.isArray(data)) {
    return R.err
  }

  const { length } = validators

  const lengthValidated = literal(length)(data.length)

  if (R.isErr(lengthValidated)) {
    return R.err
  }

  /** @type {Array<any>} */
  const result = []

  for (let i = 0; i < length; i += 1) {
    const validated = validators[i](data[i])

    if (R.isErr(validated)) {
      return R.err
    }

    result.push(validated[0])
  }

  return R.ok(result)
}

/** @type {BasicValidators$result['array']} */
const array = validator => data => {
  if (!Array.isArray(data)) {
    return R.err
  }

  /** @type {Array<any>} */
  const result = []

  for (const elem of data) {
    const validated = validator(elem)

    if (R.isErr(validated)) {
      return R.err
    }

    result.push(validated[0])
  }

  return R.ok(result)
}

/** @type {BasicValidators$result['union']} */
const union = validators => data => {
  for (const validator of validators) {
    const validated = validator(data)

    if (R.isOk(validated)) {
      return validated
    }
  }

  return R.err
}

/** @type {BasicValidators$result['undef']} */
const undef = data => data === undefined ? R.ok(undefined) : R.err

/** @type {BasicValidators$result['prop']} */
// @ts-ignore temporary
const prop = (type, key, validator) => data => {
  if (false
    || data === null
    || typeof data !== 'object'
    || Array.isArray(data)) {
    return R.err
  }

  /** @type {Record<string, any>} */
  const record = data

  if (!(key in record)) {
    return type === 'optional' ? R.ok({}) : R.err
  }

  const result = validator(record[key])

  if (R.isErr(result)) {
    return R.err
  }

  return R.ok({ [key]: result[0] })
}

/** @type {BasicValidators$result['type']} */
const type = props => data => {
  /** @type {Array<Record<string, any>>}} */
  const result = []

  for (const p of props) {
    const res = p(data)

    if (R.isErr(res)) {
      return R.err
    }

    result.push(res[0])
  }

  return R.ok(Object.assign({}, ...result))
}

/** @type {BasicValidators$result} */
const basicValidators$result = {
  enumeration,
  boolean,
  literal,
  nullVal,
  number,
  string,
  array,
  tuple,
  undef,
  union,
  prop,
  type,
}

// SECTION Exports

module.exports = { basicValidators$result }
