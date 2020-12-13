// SECTION Types

/** @typedef {<P extends ReadonlyArray<any>, R>(query: (...data: P) => Promise<R> | R) => (...data: P) => Promise<R>} registerQuery */

/** @typedef {{ registerQuery: registerQuery }} ReadonlyRepository */

// SECTION Library

/**
 * Creates new parallel repository wrapper
 *
 * @return new parallel repository
 */
function createParallelRepository () {
  /** @type {Map<symbol, Promise<any>>} */
  const tasks = new Map()

  /**
   * Registers new query in repository
   *
   * @template {ReadonlyArray<any>} P
   * @template R
   *
   * @param {(...data: P) => Promise<R> | R} query query to register
   *
   * @return {(...data: P) => Promise<R>} registered query
   */
  function registerQuery (query) {
    return (...data) => Promise
      .all(tasks.values())
      .then(() => query(...data))
  }

  /**
   * Registers new mutation in repository
   *
   * @template {ReadonlyArray<any>} P
   *
   * @param {(...data: P) => Promise<void>} mutation mutation to register
   *
   * @return {(...data: P) => void} registered mutation
   */
  function registerMutation (mutation) {
    return (...data) => {
      const key = Symbol('')

      const promise = mutation(...data)
        .finally(() => tasks.delete(key))

      tasks.set(key, promise)
    }
  }

  return { registerQuery, registerMutation }
}

/**
 * Creates new serial repository wrapper
 *
 * @return new serial repository
 */
function createSerialRepository () {
  /** @type {Promise<any> | undefined} */
  let task

  /**
   * Registers new query in repository
   *
   * @template {ReadonlyArray<any>} P
   * @template R
   *
   * @param {(...data: P) => Promise<R> | R} query query to register
   *
   * @return {(...data: P) => Promise<R>} registered query
   */
  function registerQuery (query) {
    return (...data) => {
      if (task === undefined) {
        return Promise.resolve(query(...data))
      }

      return task.then(() => query(...data))
    }
  }

  /**
   * Registers new mutation in repository
   *
   * @template {ReadonlyArray<any>} P
   *
   * @param {(...data: P) => Promise<void>} mutation mutation to register
   *
   * @return {(...data: P) => void} registered mutation
   */
  function registerMutation (mutation) {
    return (...data) => {
      task = task !== undefined
        ? task.then(() => mutation(...data))
        : mutation(...data)
    }
  }

  return { registerQuery, registerMutation }
}

/**
 * Returns a union of repositories
 *
 * @param {ReadonlyArray<ReadonlyRepository>} repositories first repository
 *
 * @return {ReadonlyRepository} union repository
 */
function getRepositoryUnion (...repositories) {
  const tasks = repositories.map(repo => repo.registerQuery(() => Promise.resolve()))

  /**
   * Registers new query in repository
   *
   * @template {ReadonlyArray<any>} P
   * @template R
   *
   * @param {(...data: P) => Promise<R> | R} query query to register
   *
   * @return {(...data: P) => Promise<R>} registered query
   */
  function registerQuery (query) {
    return (...data) => Promise
      .all(tasks.map(task => task()))
      .then(() => query(...data))
  }

  return { registerQuery }
}

// SECTION Exports

module.exports = { createParallelRepository, createSerialRepository, getRepositoryUnion }
