import { Option } from './option'

// SECTION Types

/** Represents json array */
export type JsonArray = ReadonlyArray<Json>

/** Represents json object */
export type JsonRecord = { readonly [key: string]: Json | undefined }

/** Represents all possible json values */
export type Json = boolean | number | string | null | JsonRecord | JsonArray | readonly []

// SECTION Library

/** Encodes json value to string */
export const encode: (data: Json) => string

/** Decodes json value from string */
export const decode: (data: string) => Option<Json>
