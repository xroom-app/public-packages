import { Endo, Arrow } from './function'
import { Predicate } from './predicate'
import { Option } from './option'

// SECTION Library

/** Applies function to every element of Iterable */
export const forEach: <T>(func: Arrow<T, void>) => Arrow<Iterable<T>, void>

/** Returns new Iterable with mapper function applied */
export const map: <T, R>(func: Arrow<T, R>) => Arrow<Iterable<T>, Iterable<R>>

/** Returns new Iterable with elements matches predicate */
export const filter: <T>(predicate: Predicate<[T]>) => Endo<Iterable<T>>

/** Returns new Iterable with elements of both Iterables */
export const merge: <T1, T2>(iter1: Iterable<T1>, iter2: Iterable<T2>) => Iterable<T1 | T2>

/** Returns result of iterable reduce with function passed */
export const reduce: <A, B>(func: (acc: A, elem: B) => A, init: A) => (iter: Iterable<B>) => A

/** Returns result of iterable fold with function passed */
export const fold: <A>(func: (acc: A, elem: A) => A) => (iter: Iterable<A>) => O.Option<A>

/** Returns count of elements matches predicate */
export const countMatches: <T>(predicate: Predicate<[T]>) => (iter: Iterable<T>) => number
