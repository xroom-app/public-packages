import { Option } from '@xroom.app/data-types/lib/option'
import { Json } from '@xroom.app/data-types/lib/json'

// SECTION Types

/** Represents tuple */
export type Tuple<T> = ReadonlyArray<T> & { 0: T }

// SECTION Library

/** Checks does value is equal to template */
export const same: <T extends string | number | boolean>(value: Option<Json>, template: T) => value is T

/** Returns type of the variable passed */
export const getTypeOf: (data: Option<Json>) => string

/** Converts literal to string representation */
export const literalToString: (data: string | boolean | number) => string
