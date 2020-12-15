// SECTION Types

/** Left type provides data about error when something went wrong */
type Left<E> = { __tag: 'left', data: E }

/** Right type provides data when everything is ok */
type Right<T> = { __tag: 'right', data: T }

/** Either type represents data with possible error */
type Either<E, T> = Left<E> | Right<T>

// SECTION Constants

/** Constructor for the Left type */
export const left: <E>(data: E) => Either<E, never>

/** Constructor for the Right type */
export const right: <T>(data: T) => Either<never, T>

// SECTION Library

/** Returns true if Either instance is Left */
export const isLeft: <E, T>(either: Either<E, T>) => either is Left<E>

/** Returns true if Either instance is Right */
export const isRight: <E, T>(either: Either<E, T>) => either is Right<T>

/** Maps value of Either if it is Right */
export const map: <E, T, R>(either: Either<E, T>, func: (data: T) => R) => Either<E, R>

/** Maps value of Either if it is Left */
export const mapLeft: <E1, E2, T>(either: Either<E1, T>, func: (error: E1) => E2) => Either<E2, T>

/** Chains Either value with function */
export const chain: <E1, T, E2, R>(either: Either<E1, T>, func: (data: T) => Either<E2, R>) => Either<E1 | E2, R>

/** Unsafely runs Either instance throwing exception for Left case and returning value for Right case */
export const unpackUnsafe: <E, T>(either: Either<E, T>) => T
