// SECTION Library

/** Creates new set by iterable object passed */
export const create: <T = never>(elements?: Iterable<T>) => Set<T>

/** Returns union of two sets */
export const union: <T1, T2>(set1: Set<T1>, set2: Set<T2>) => Set<T1 | T2>

/** Separates set on two sets: the first one is for elements passes predicate and the second one is for others */
export const separate: <T>(predicate: (elem: T) => boolean) => (set: Set<T>) => [onTrue: Set<T>, onFalse: Set<T>]

/** Returns true if some set element passes predicate */
export const some: <T>(predicate: (elem: T) => boolean) => (set: Set<T>) => boolean

/** Returns true if every set element passes predicate */
export const every: <T>(predicate: (elem: T) => boolean) => (set: Set<T>) => boolean

/** Returns set with elements mapped by function */
export const map: <I, O>(func: (elem:I) => O) => (set: Set<I>) => Set<O>

/** Returns set with elements passes predicate */
export const filter: <T>(predicate: (elem: T) => boolean) => (set: Set<T>) => Set<T>
