// SECTION Library

/** @type {<T = never>(elements?: Iterable<T>) => Set<T>} */
const create = elements => new Set(elements)

/** @type {<T1, T2>(set1: Set<T1>, set2: Set<T2>) => Set<T1 | T2>} */
const union = (set1, set2) => create([...set1, ...set2])

/** @type {<T>(predicate: (elem: T) => boolean) => (set: Set<T>) => [onTrue: Set<T>, onFalse: Set<T>]} */
const separate = predicate => set => {
  /** @type {typeof set} */
  const onTrue = create()
  /** @type {typeof set} */
  const onFalse = create()

  for (const elem of set) {
    (predicate(elem)
      ? onTrue
      : onFalse
    ).add(elem)
  }

  return [onTrue, onFalse]
}

/** @type {<T>(predicate: (elem: T) => boolean) => (set: Set<T>) => boolean} */
const some = predicate => set => {
  for (const elem of set) {
    if (predicate(elem)) {
      return true
    }
  }

  return false
}

/** @type {<T>(predicate: (elem: T) => boolean) => (set: Set<T>) => boolean} */
const every = predicate => set => {
  for (const elem of set) {
    if (!predicate(elem)) {
      return false
    }
  }

  return true
}

/** @type {<I, O>(func: (elem:I) => O) => (set: Set<I>) => Set<O>} */
const map = func => set => {
  /** @type {Set<ReturnType<typeof func>>} */
  const result = create()

  for (const elem of set) {
    result.add(func(elem))
  }

  return result
}

/** @type {<T>(predicate: (elem: T) => boolean) => (set: Set<T>) => Set<T>} */
const filter = predicate => set => {
  /** @type {typeof set} */
  const result = create()

  for (const elem of set) {
    if (predicate(elem)) {
      result.add(elem)
    }
  }

  return result
}

// SECTION Exports

module.exports = { create, union, separate, some, every, map, filter }
