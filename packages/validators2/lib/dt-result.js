const F = require('@xroom.app/data-types/lib/function')
const R = require('@xroom.app/data-types/lib/result')

// SECTION Types

// MODULE Imports

/** @typedef {import('./basic-alg').ValidatorType} ValidatorType */

/** @typedef {import('@xroom.app/data-types/lib/json').Json} Json */

/** @typedef {import('./dt-alg').ValidatorDataType<'result'>} ValidatorDataType */

/** @template P @typedef {import('./basic-alg').Validator<'result', P>} Validator */

/** @template T @typedef {import('@xroom.app/data-types/lib/option').Option<T>} Option */

// SECTION Library

/** @type {ValidatorDataType['map']} */
const map = (validator, mapper) => F.flow(validator, R.map(mapper))

/** @type {ValidatorDataType['chain']} */
const chain = (first, second) => F.flow(first, R.chain(second))

/** @type {ValidatorDataType} */
const validatorDataType$result = { map, chain }

// SECTION Exports

module.exports = { validatorDataType$result }
