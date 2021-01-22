// SECTION Types

/** @template {ReadonlyArray<any>} P, R @typedef {(...args: P) => R} Func */

/** @template P, R @typedef {Func<[P], R>} Arrow */

/** @template T @typedef {Arrow<T, T>} Endo */

/** @template T @typedef {Func<[], T>} Lazy */

// SECTION Library

/** @type {<A extends ReadonlyArray<any>, B, C>(func1: Func<A, B>, func2: Arrow<B, C>) => Func<A, C>} */
const flow = (func1, func2) => (...args) => func2(func1(...args))

// SECTION Exports

module.exports = { flow }
