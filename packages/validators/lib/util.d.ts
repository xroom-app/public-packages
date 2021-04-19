// SECTION Types

/** Represents tuple */
export type Tuple<T> = ReadonlyArray<T> & { 0: T }

// SECTION Library

/** Checks does value is equal to template */
export const same: <V extends unknown, T>(value: V, template: T) => value is V & T

/** Returns type of the variable passed */
export const getTypeOf: (data: unknown) => string

/** Converts literal to string representation */
export const literalToString: (data: string | boolean | number) => string
