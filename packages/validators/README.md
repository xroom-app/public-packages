# Data validators library

## Installation

Run from command line

```
npm i @xroom.app/validators
```

## Usage example

### Define your own validators

```js
const V = require('@xroom.app/validators/lib/data-type')
const ER = require('@xroom.app/validators/lib/errors')
const E = require('@xroom.app/data-types/lib/either')
const T = require('@xroom.app/validators/lib/basic')

// SECTION Types

// MODULE Imports

/** @template T @typedef {import('@xroom.app/validators/lib/basic').ValidationResult<T>} ValidationResult */

/** @template T1, T2 @typedef {import('@xroom.app/validators/lib/basic').ValidatorExtension<T1, T2>} ValidatorExtension */

// SECTION Constants

/** @type {<T extends { length: number }>(data: T) => ValidationResult<T>} */
const nonEmpty = data => data.length !== 0 ? E.right(data) : E.left([ER.conditionError('non empty', data)])

/** @type {(validator: ValidatorExtension<number, number>) => <T extends { length: number }>(data: T) => ValidationResult<T>} */
const lengthMatches = validator => data => {
  const result = validator(data.length)

  if (E.isRight(result)) { return E.right(data) }

  return E.left([ER.fieldError('length'), ...result.data])
}

/** @type {(number: number) => <N extends number>(data: N) => ValidationResult<N>} */
const leq = number => data => data <= number ? E.right(data) : E.left([ER.conditionError(`less or equal to ${number}`, data)])
```

### Combine your and bundled validators into models

```js
const validatePassword = V.chain(V.chain(T.string, nonEmpty), lengthMatches(leq(32)))

const validateOptions = T.type([
  T.prop('required', 'lock', T.boolean),
  T.prop('optional', 'password', validatePassword),
])
```

### Get readable errors out of box

```js
const data = {
  password: '',
  lock: false,
}

const result = validateOptions(data)

if (E.isLeft(result)) {
  // Error:  [
  //   { __tag: 'field', field: 'password' },
  //   { __tag: 'condition', condition: 'non empty', value: '' }
  // ]
  console.log('Error: ', result.data)
}
```
