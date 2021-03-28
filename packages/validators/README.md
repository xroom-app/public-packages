# Data validators library

## Installation

Run from command line

```
npm i @xroom.app/validators
```

## Usage example

```js
const E = require('@xroom.app/data-types/lib/either')
const T = require('@xroom.app/validators/lib/basic')

/** @type {(x: number, y: number) => number} */
const add = (x, y) => x + y

const getUnsafeData = () => Math.round(Math.random()) ? 1 : ''

const unsafeData = Array(2).fill(0).map(getUnsafeData)

console.log('unsafeData: ', unsafeData)

const numberData = T.array(T.number)(unsafeData)

// Throws an error if data array contained strings, or logs the numbers sum otherwise
console.log(`number data sum equals ${E.extractUnsafe(numberData).reduce(add)}`)
```
