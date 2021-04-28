// SECTION Types

// MODULE Imports

/** @typedef {import('./basic-alg').ValidatorType} ValidatorType */

/** @template {ValidatorType} T, R @typedef {import('./basic-alg').Validator<T, R>} Validator */

/** @template {ValidatorType} T, P, R @typedef {import('./basic-alg').ValidatorExtension<T, P, R>} ValidatorExtension */

// MODULE Algebras

/** @template {ValidatorType} T @typedef {{ map: <P, R>(validator: Validator<T, P>, mapper: (data: P) => R) => Validator<T, R> }} Map */

/** @template {ValidatorType} T @typedef {{ chain: <P, R>(first: Validator<T, P>, second: ValidatorExtension<T, P, R>) => Validator<T, R> }} Chain */

/**
 * @template {ValidatorType} T
 *
 * @typedef {(
 *  & Chain<T>
 *  & Map<T>
 * )} ValidatorDataType
 */

// SECTION Exports

export default {}
