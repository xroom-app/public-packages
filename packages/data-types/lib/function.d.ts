// SECTION Types

/** Represents function with parameters P and result R */
export type Func<P extends ReadonlyArray<any>, R> = (...args: P) => R

// SECTION Library

/** Returns function that applies second function to the result of first */
export const flow: <A extends ReadonlyArray<any>, B, C>(func1: Func<A, B>, func2: Func<[B], C>) => Func<A, C>
