# Data validators library

## Installation

Run from command line

```
npm i @xroom.app/validators2
```

## Usage example

### Define your own validators

```js
const { basicValidators$result } = require('./lib/basic-result')
const { basicValidators$either } = require('./lib/basic-either')
const { validatorDataType$result } = require('./lib/dt-result')
const { validatorDataType$either } = require('./lib/dt-either')
const E = require('@xroom.app/data-types/lib/either')
const R = require('@xroom.app/data-types/lib/result')
const ER = require('./lib/errors')

// SECTION Types

// MODULE Imports

/** @typedef {import('./lib/basic-alg').ValidatorType} ValidatorType */

/** @template T @typedef {import('./lib/basic-alg').ValidationResult<T>} ValidationResult */

/** @template {ValidatorType} T, P @typedef {import('./lib/basic-alg').Validator<T, P>} Validator */

/** @template {ValidatorType} T @typedef {import('./lib/basic-alg').BasicValidators<T>} BasicValidators */

/** @template {ValidatorType} T @typedef {import('./lib/dt-alg').ValidatorDataType<T>} ValidatorDataType */

/** @template {ValidatorType} T, P, R @typedef {import('./lib/basic-alg').ValidatorExtension<T, P, R>} ValidatorExtension */

// MODULE Algebras

/** @template {ValidatorType} T @typedef {{ nonEmpty: <P extends { length: number }>(data: P) => ValidationResult<P>[T] }} NonEmpty */

/**
 * @template {ValidatorType} T @typedef {{ lengthMatches:
 *   (validator: ValidatorExtension<T, number, number>) =>
 *     <P extends { length: number }>(data: P) => ValidationResult<P>[T]
 * }} LengthMatches
 */

/** @template {ValidatorType} T @typedef {{ leq: (number: number) => <N extends number>(data: N) => ValidationResult<N>[T] }} Leq */

/**
 * @template {ValidatorType} T
 *
 * @typedef {(
 *  & Leq<T>
 *  & NonEmpty<T>
 *  & LengthMatches<T>
 * )} CustomValidators
 */

/**
 * @template {ValidatorType} T
 * @typedef {(
 *  & BasicValidators<T>
 *  & CustomValidators<T>
 *  & ValidatorDataType<T>
 * )} ValidatorCombinators
 */

// SECTION Constants

// MODULE Either custom validators

/** @type {CustomValidators<'either'>['nonEmpty']} */
const nonEmpty$either = data => data.length !== 0 ? E.right(data) : E.left([ER.conditionError('non empty', data)])

/** @type {CustomValidators<'either'>['lengthMatches']} */
const lengthMatches$either = validator => data => {
  const result = validator(data.length)

  if (E.isRight(result)) { return E.right(data) }

  return E.left([ER.fieldError('length'), ...result.data])
}

/** @type {CustomValidators<'either'>['leq']} */
const leq$either = number => data => data <= number ? E.right(data) : E.left([ER.conditionError(`less or equal to ${number}`, data)])

/** @type {CustomValidators<'either'>} */
const customValidators$either = {
  lengthMatches: lengthMatches$either,
  nonEmpty: nonEmpty$either,
  leq: leq$either,
}

// MODULE Result custom validators

/** @type {CustomValidators<'result'>['nonEmpty']} */
const nonEmpty$result = data => data.length !== 0 ? R.ok(data) : R.err

/** @type {CustomValidators<'result'>['lengthMatches']} */
const lengthMatches$result = validator => data => {
  const result = validator(data.length)

  if (R.isOk(result)) { return R.ok(data) }

  return R.err
}

/** @type {CustomValidators<'result'>['leq']} */
const leq$result = number => data => data <= number ? R.ok(data) : R.err

/** @type {CustomValidators<'result'>} */
const customValidators$result = {
  lengthMatches: lengthMatches$result,
  nonEmpty: nonEmpty$result,
  leq: leq$result,
}

// MODULE Interpreters

/** @type {ValidatorCombinators<'result'>} */
const resultCombinators = { ...validatorDataType$result, ...basicValidators$result, ...customValidators$result }

/** @type {ValidatorCombinators<'either'>} */
const eitherCombinators = { ...validatorDataType$either, ...basicValidators$either, ...customValidators$either }

```

### Combine your and bundled validators into models

```js
// MODULE Data validators

/** @type {<T extends ValidatorType>(V: ValidatorCombinators<T>) => Validator<T, string>} */
const validatePassword = V => V.chain(V.chain(V.string, V.nonEmpty), V.lengthMatches(V.leq(32)))

/**
 * @typedef {{
 *   lock: boolean
 *   password?: string
 * }} Options
 */

/** @type {<T extends ValidatorType>(V: ValidatorCombinators<T>) => Validator<T, Options>} */
const validateOptions = V => V.type([
  V.prop('required', 'lock', V.boolean),
  V.prop('optional', 'password', validatePassword(V)),
])
```

### Get readable errors out of box or just boolean

```js
// MODULE Data validation

const data = {
  password: '1',
  lock: false,
}

// In case if you need rich errors

const result1 = validateOptions(eitherCombinators)(data)

if (E.isLeft(result1)) {
  // Error:  [
  //   { __tag: 'field', field: 'password' },
  //   { __tag: 'condition', condition: 'non empty', value: '' }
  // ]
  console.log('Error: ', result1.data)
}

// In case if you need just boolean result

const result2 = validateOptions(resultCombinators)(data)

if (R.isErr(result2)) {
  console.log('Error by result2')
}

```
