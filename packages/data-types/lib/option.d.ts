// SECTION Types

/** Represents None type */
type None = undefined

/** Represents Some type */
type Some<T> = T

/** Represents optional value */
type Option<T> = Some<T> | None

// SECTION Constants

/** Empty value */
export const none: Option<never>

/** Value contains data */
export const some: <T>(data: T) => Option<T>

// SECTION Library

/** Returns true if passed data is None */
export const isNone: <T>(data: Option<T>) => data is None

/** Returns true if passed data is Some */
export const isSome: <T>(data: Option<T>) => data is Some<T>

/** Maps option value with function */
export const map: <P, R>(func: (data: P) => R) => (data: Option<P>) => Option<R>

/** Chains option value with function */
export const chain: <P, R>(func: (data: P) => Option<R>) => (data: Option<P>) => Option<R>

/** Returns alternative value if Option is None */
export const getOrElse: <T1>(value: () => T1) => <T2>(data: Option<T2>) => T1 | T2

/** Returns None if value passed is null */
export const fromNullable: <T>(value: T | null) => Option<T>
