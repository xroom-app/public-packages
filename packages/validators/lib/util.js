// SECTION Types

/** @template T @typedef {(ReadonlyArray<T> & { readonly 0: T }) | readonly []} Tuple */

// SECTION Library

/** @type {<V extends unknown, T>(value: V, template: T) => value is V & T} */
const same = (value, template) => value === template

/** @type {(data: unknown) => string} */
const getTypeOf = data => {
  const type = typeof data

  if (type !== 'object') { return type }

  if (data === null) { return 'null' }

  if (Array.isArray(data)) { return 'Array' }

  return 'object'
}

/** @type {(data: string | boolean | number) => string} */
const literalToString = data => typeof data === 'string' ? `'${data}'` : String(data)

// SECTION Exports

module.exports = { same, getTypeOf, literalToString }
