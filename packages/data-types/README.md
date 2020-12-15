# Useful data types written in javascript

## Installation

Run from command line

```
npm i @xroom.app/data-types
```

## Usage example

```js
const E = require('@xroom.app/data-types/lib/either')

/** @type {(x: number) => (y: number) => number} */
const add = x => y => x + y

/** @type {<T>(data: T) => E.Either<string, T>} */
const checkNotZero = data => data !== 0 ? E.right(data) : E.left('zero')

const unsafeData = Math.round(Math.random())

const result = E.map(checkNotZero(unsafeData), add(10))

// Will log the message if unsafeData = 1 or throw an error if unsafeData = 0
console.log(`unsafeData + 10 = ${E.unpackUnsafe(result)}`)
```
