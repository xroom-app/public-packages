// SECTION Types

/** @typedef {undefined} None */

/** @template T @typedef {T} Some */

/** @template T @typedef {Some<T> | None} Option */

// SECTION Constants

/** @type {Option<never>} */
const none = undefined

/** @type {<T>(data: T) => Option<T>} */
const some = data => data

// SECTION Library

/** @type {<T>(data: Option<T>) => data is None} */
const isNone = data => data === none

/** @type {<T>(data: Option<T>) => data is Some<T>} */
const isSome = data => data !== none

/** @type {<P, R>(func: (data: P) => R) => (data: Option<P>) => Option<R>} */
const map = func => data => isSome(data) ? func(data) : none

/** @type {<P, R>(func: (data: P) => Option<R>) => (data: Option<P>) => Option<R>} */
const chain = func => data => isSome(data) ? func(data) : none

/** @type {<T1>(value: () => T1) => <T2>(data: Option<T2>) => T1 | T2} */
const getOrElse = value => data => isSome(data) ? data : value()

/** @type {<T>(value: T | null) => Option<T>} */
const fromNullable = value => value !== null ? value : none

// SECTION Exports

module.exports = { none, some, isNone, isSome, map, chain, getOrElse, fromNullable }
