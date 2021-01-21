// SECTION Types

/** @template {ReadonlyArray<any>} P, R @typedef {(...args: P) => R} Func */

// SECTION Library

/** @type {<A extends ReadonlyArray<any>, B, C>(func1: Func<A, B>, func2: Func<[B], C>) => Func<A, C>} */
const flow = (func1, func2) => (...args) => func2(func1(...args))

// SECTION Exports

module.exports = { flow }
