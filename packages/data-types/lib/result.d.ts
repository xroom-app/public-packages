import { Arrow, Lazy } from './function'
import { Option } from './option'

// SECTION Types

/** Represents Error case */
type Err = []

/** Represents Ok case */
type Ok<T> = [T]

/** Represents Result container */
type Result<T> = Err | Ok<T>

// SECTION Constants

/** Empty value */
export const err: Result<never>

/** Value contains data */
export const ok: <T>(data: T) => Result<T>

// SECTION Library

/** Returns true if passed data is Err */
export const isErr: <T>(data: Result<T>) => data is Err

/** Returns true if passed data is Ok */
export const isOk: <T>(data: Result<T>) => data is Ok<T>

/** Maps Result value with function */
export const map: <P, R>(func: Arrow<P, R>) => Arrow<Result<P>, Result<R>>

/** Chains Result value with function */
export const chain: <P, R>(func: Arrow<P, Result<R>>) => Arrow<Result<P>, Result<R>>

/** Returns alternative value if Result is Err */
export const getOrElse: <T1>(value: Lazy<T1>) => <T2>(data: Result<T2>) => T1 | T2

/** Builds Result value from Option */
export const fromOption: <T>(value: Option<T>) => Result<T>
