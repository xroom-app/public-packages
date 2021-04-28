const E = require('@xroom.app/data-types/lib/either')

// SECTION Types

// MODULE Imports

/** @typedef {import('./dt-alg').ValidatorDataType<'either'>} ValidatorDataType */

// SECTION Library

/** @type {ValidatorDataType['map']} */
const map = (validator, mapper) => data => E.map(validator(data), mapper)

/** @type {ValidatorDataType['chain']} */
const chain = (first, second) => data => E.chain(first(data), second)

/** @type {ValidatorDataType} */
const validatorDataType$either = { map, chain }

// SECTION Exports

module.exports = { validatorDataType$either }
