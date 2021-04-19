import { Either } from '@xroom.app/data-types/lib/either'
import { ValidateError } from './errors'
import { Tuple } from './util'

// SECTION Types

/** Possible property types */
type PropType = 'optional' | 'required'

/** Standard unknown value validator */
export type Validator<T> = ValidatorExtension<unknown, T>

/** Result of validation - array of errors or value of type T */
export type ValidationResult<T> = Either<ReadonlyArray<ValidateError>, T>

/** Validates data T1 and returns validation result of type T2 */
export type ValidatorExtension<T1, T2> = (data: T1) => ValidationResult<T2>

/** Converts information about property to object type */
type PropToObject<P extends PropType, K extends string, T> = P extends 'optional' ? { [KEY in K]?: T } : { [KEY in K]: T }

/** Returns type of validator passed */
export type ValidatorType<V extends Validator<any>> = V extends Validator<infer T> ? T : never

/** Merges tuple of prop validators to a single object validator */
type PropsToObject<T extends Tuple<Validator<Record<string, any>>>> = UnionToIntersection<ValidatorType<T[number]>>

/** Computes type to show it in extended form */
type Compute<T> = T extends Function ? T : { [K in keyof T]: T[K] } & unknown

/** Converts union of types to its intersection */
type UnionToIntersection<U> = Compute<(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never>

/** Converts tuple of validators to tuple of validator types */
type TupleFromValidator<T extends Tuple<Validator<any>>> =
  T extends [infer HEAD, ...infer Tail]
  ? HEAD extends Validator<any>
    ? Tail extends Tuple<Validator<any>>
      ? [ValidatorType<HEAD>, ...TupleFromValidator<Tail>]
      : [ValidatorType<HEAD>]
    : []
  : []

// SECTION Constants

/** Validates that value is string */
export const string: Validator<string>

/** Validates that value is number */
export const number: Validator<number>

/** Validates that value is boolean */
export const boolean: Validator<boolean>

/** Validates that value is null */
export const nullVal: Validator<null>

/** Validates that value is undefined */
export const undef: Validator<undefined>

/** Validates that value equals literal passed */
export const literal: <T extends string | boolean | number>(value: T) => Validator<T>

/** Validates that value is array of type determined by validator passed */
export const array: <T>(validator: Validator<T>) => Validator<ReadonlyArray<T>>

/** Validates that value is tuple with all elements matching validators passed  */
export const tuple: <T extends Tuple<Validator<any>>>(validators: T) => Validator<TupleFromValidator<T>>

/** Validates that value is a member of enumeration passed */
export const enumeration: <T extends string | boolean | number>(object: Record<string, T>) => Validator<T>

/** Validates that value satisfies at least one of validators passed */
export const union: <T extends Tuple<Validator<any>>>(validators: T) => Validator<ValidatorType<T[number]>>

/** Validates that value is object containing prop K with value of type T */
export const prop: <P extends PropType, K extends string, T>(type: P, key: K, validator: Validator<T>) => Validator<PropToObject<P, K, T>>

/** Merges prop validators into a single object validator */
export const type: <P extends Tuple<Validator<Record<string, any>>>>(props: P) => Validator<PropsToObject<P>>
