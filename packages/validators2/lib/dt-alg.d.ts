import { Validator, ValidatorExtension } from './basic-alg'
import { ValidatorType } from './basic-alg'

// SECTION Types

/** Updates inner validator value with function */
type Map<T extends ValidatorType> = { map: <P, R>(validator: Validator<T, P>, mapper: (data: P) => R) => Validator<T, R> }

/** Updates inner validator value with validator extension */
type Chain<T extends ValidatorType> = { chain: <P, R>(first: Validator<T, P>, second: ValidatorExtension<T, P, R>) => Validator<T, R> }

/** Represents data type for validator */
export type ValidatorDataType<T extends ValidatorType> =
  & Chain<T>
  & Map<T>
