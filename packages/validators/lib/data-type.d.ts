import { Validator, ValidatorExtension } from './basic'

// SECTION Library

/** Applies function to validator value */
export const map: <T, R>(validator: Validator<T>, mapper: (data: T) => R) => Validator<R>

/** Evolves validator value with validator extension */
export const chain: <T1, T2>(first: Validator<T1>, second: ValidatorExtension<T1, T2>) => Validator<T2>
