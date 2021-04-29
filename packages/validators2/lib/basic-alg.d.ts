import { Option } from '@xroom.app/data-types/lib/option'
import { Result } from '@xroom.app/data-types/lib/result'
import { Json } from '@xroom.app/data-types/lib/json'
import { ValidationResult } from './basic-either'
import { Tuple } from './util'

// SECTION Types

// MODULE Declarations

/** Possible property types */
type PropType = 'optional' | 'required'

/** Possible validator types */
export type ValidatorType = keyof ValidationResults<any>

/** Possible validator types with its results */
export type ValidationResults<T> = { result: Result<T>, either: ValidationResult<T> }

/** Represents validator from type Json to type ValidationResults<R>[T] */
export type Validator<T extends ValidatorType, R> = ValidatorExtension<T, Option<Json>, R>

/** Represents validator from type P to type ValidationResults<R>[T] */
export type ValidatorExtension<T extends ValidatorType, P, R> = (data: P) => ValidationResults<R>[T]

/** Converts information about property to object type */
type PropToObject<P extends PropType, K extends string, T> = P extends 'optional' ? { [KEY in K]?: T } : { [KEY in K]: T }

/** Converts tuple of validators to tuple of validator types */
type TupleFromValidator<T extends Tuple<Validator<any, any>>> = T extends [infer HEAD, ...infer Tail]
  ? HEAD extends Validator<any, any>
    ? Tail extends Tuple<Validator<any, any>>
      ? [ValidatorContent<HEAD>, ...TupleFromValidator<Tail>]
      : [ValidatorContent<HEAD>]
  : [] : []

/** Computes type to show it in extended form */
type Compute<T> = T extends Function ? T : { [K in keyof T]: T[K] } & unknown

/** Returns content of validator passed */
export type ValidatorContent<V extends Validator<any, any>> = V extends Validator<any, infer T> ? T : never

/** Merges tuple of prop validators to a single object validator */
type PropsToObject<T extends Tuple<Validator<any, Record<string, any>>>> = UnionToIntersection<ValidatorContent<T[number]>>

/** Converts union of types to its intersection */
type UnionToIntersection<U> = Compute<(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never>

// MODULE Algebras

/** Validates that value is null */
export type NullValidator<T extends ValidatorType> = { nullVal: Validator<T, null> }

/** Validates that value is string */
export type StringValidator<T extends ValidatorType> = { string: Validator<T, string> }

/** Validates that value is number */
export type NumberValidator<T extends ValidatorType> = { number: Validator<T, number> }

/** Validates that value is boolean */
export type BooleanValidator<T extends ValidatorType> = { boolean: Validator<T, boolean> }

/** Validates that value is undefined */
export type UndefinedValidator<T extends ValidatorType> = { undef: Validator<T, undefined> }

/** Validates that value is array of type determined by validator passed */
export type ArrayValidator<T extends ValidatorType> = { array: <P>(validator: Validator<T, P>) => Validator<T, ReadonlyArray<P>> }

/** Validates that value equals literal passed */
export type LiteralValidator<T extends ValidatorType> = { literal: <P extends string | boolean | number>(value: P) => Validator<T, P> }

/** Validates that value is a member of enumeration passed */
export type EnumValidator<T extends ValidatorType> = { enumeration: <P extends string | boolean | number>(object: Record<string, P>) => Validator<T, P> }

/** Validates that value is tuple with all elements matching validators passed  */
export type TupleValidator<T extends ValidatorType> = { tuple: <P extends Tuple<Validator<T, any>>>(validators: P) => Validator<T, TupleFromValidator<P>> }

/** Merges prop validators into a single object validator */
export type TypeValidator<T extends ValidatorType> = { type: <P extends Tuple<Validator<T, Record<string, any>>>>(props: P) => Validator<T, PropsToObject<P>> }

/** Validates that value satisfies at least one of validators passed */
export type UnionValidator<T extends ValidatorType> = { union: <P extends Tuple<Validator<T, any>>>(validators: P) => Validator<T, ValidatorContent<P[number]>> }

/** Validates that value is object containing prop K with value of type T */
export type PropValidator<T extends ValidatorType> = { prop: <P extends PropType, K extends string, R>(type: P, key: K, validator: Validator<T, R>) => Validator<T, PropToObject<P, K, R>> }

/** Represents all basic validators */
export type BasicValidators<T extends ValidatorType> =
  & UndefinedValidator<T>
  & LiteralValidator<T>
  & BooleanValidator<T>
  & StringValidator<T>
  & NumberValidator<T>
  & ArrayValidator<T>
  & UnionValidator<T>
  & TupleValidator<T>
  & EnumValidator<T>
  & PropValidator<T>
  & NullValidator<T>
  & TypeValidator<T>
