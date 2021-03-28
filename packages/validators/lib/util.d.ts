// SECTION Types

/** Represents tuple */
export type Tuple<T> = ReadonlyArray<T> & { 0: T }

// SECTION Library

/** Adds value to the beginning of array */
export const prepend: <T>(element: T) => (array: ReadonlyArray<T>) => ReadonlyArray<T>

/** Checks does value is equal to template */
export const same: <V extends unknown, T>(value: V, template: T) => value is V & T

/** Lazy composition array map -> find */
export const mapFind: <T, R>(mapper: (value: T) => R, predicate: (value: R) => boolean) => (array: ReadonlyArray<T>) => R | undefined

/** Returns type of the variable passed */
export const getTypeOf: (data: unknown) => string

/** Converts literal to string representation */
export const literalToString: (data: string | boolean | number) => string
