const E = require('@xroom.app/data-types/lib/either')

// SECTION Types

// MODULE Imports

/** @template T @typedef {import('./basic').Validator<T>} Validator */

/** @template T1, T2 @typedef {import('../lib/basic').ValidatorExtension<T1, T2>} ValidatorExtension */

// SECTION Library

/** @type {<T, R>(validator: Validator<T>, mapper: (data: T) => R) => Validator<R>} */
const map = (validator, mapper) => data => E.map(validator(data), mapper)

/** @type {<T1, T2>(first: Validator<T1>, second: ValidatorExtension<T1, T2>) => Validator<T2>} */
const chain = (first, second) => data => E.chain(first(data), second)

// SECTION Exports

module.exports = { map, chain }
