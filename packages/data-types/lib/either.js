// SECTION Types

// MODULE Imports

/** @template P, R @typedef {import('./function').Arrow<P, R>} Arrow */

// MODULE Declarations

/** @template E @typedef {{ __tag: 'left', data: E }} Left */

/** @template T @typedef {{ __tag: 'right', data: T }} Right */

/** @template E, T @typedef {Left<E> | Right<T>} Either */

// SECTION Constants

/** @type {'left'} */
const leftTag = 'left'

/** @type {'right'} */
const rightTag = 'right'

/** @type {<E>(data: E) => Either<E, never>} */
const left = data => ({ __tag: leftTag, data })

/** @type {<T>(data: T) => Either<never, T>} */
const right = data => ({ __tag: rightTag, data })

// SECTION Library

/** @type {<E, T>(either: Either<E, T>) => either is Left<E>} */
const isLeft = either => either.__tag === leftTag

/** @type {<E, T>(either: Either<E, T>) => either is Right<T>} */
const isRight = either => either.__tag === rightTag

/** @type {<E, T, R>(either: Either<E, T>, func: Arrow<T, R>) => Either<E, R>} */
const map = (either, func) => isLeft(either) ? either : right(func(either.data))

/** @type {<E1, E2, T>(either: Either<E1, T>, func: Arrow<E1, E2>) => Either<E2, T>} */
const mapLeft = (either, func) => isLeft(either) ? left(func(either.data)) : either

/** @type {<E1, T, E2, R>(either: Either<E1, T>, func: Arrow<T, Either<E2, R>>) => Either<E1 | E2, R>} */
const chain = (either, func) => isLeft(either) ? either : func(either.data)

/** @type {<E, T>(either: Either<E, T>) => T} */
const extractUnsafe = either => { if (isLeft(either)) { throw either.data } return either.data }

// SECTION Exports

module.exports = { left, right, isLeft, isRight, map, mapLeft, chain, extractUnsafe }
