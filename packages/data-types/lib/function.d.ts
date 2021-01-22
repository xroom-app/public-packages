// SECTION Types

/** Represents function with parameters P and result R */
export type Func<P extends ReadonlyArray<any>, R> = (...args: P) => R

/** Represents function with a single parameter P and result R */
export type Arrow<P, R> = Func<[P], R>

/** Endomorphism for type T */
export type Endo<T> = Arrow<T, T>

/** Represents lazy value T */
export type Lazy<T> = Func<[], T>

// SECTION Library

/** Returns function that applies second function to the result of first */
export const flow: <A extends ReadonlyArray<any>, B, C>(func1: Func<A, B>, func2: Arrow<B, C>) => Func<A, C>
