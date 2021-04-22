// SECTION Types

// MODULE Imports

/** @typedef {import('@xroom.app/data-types/lib/json').Json} Json */

/** @template T @typedef {import('@xroom.app/data-types/lib/option').Option<T>} Option */

// MODULE Declarations

/** @template T @typedef {(ReadonlyArray<T> & { readonly 0: T }) | readonly []} Tuple */

// SECTION Library

/** @type {<T extends string | number | boolean>(value: Option<Json>, template: T) => value is T} */
const same = (value, template) => value === template

/** @type {(data: Option<Json>) => string} */
const getTypeOf = data => {
  const type = typeof data

  if (type !== 'object') { return type }

  if (data === null) { return 'null' }

  if (Array.isArray(data)) { return 'Array' }

  return 'Object'
}

/** @type {(data: string | boolean | number) => string} */
const literalToString = data => typeof data === 'string' ? `'${data}'` : String(data)

// SECTION Exports

module.exports = { same, getTypeOf, literalToString }
