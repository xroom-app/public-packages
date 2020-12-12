// SECTION Types

/** @typedef {import('child_process').ChildProcess} ChildProcess */

/**
 * @template {(ReadonlyArray<any>)} T
 *
 * @typedef {(...args: T) => ChildProcess} ProcessSpawner
 */

// SECTION Library

/**
 * Creates new process limiter
 *
 * @template {ReadonlyArray<any>} T
 *
 * @param {ProcessSpawner<T>} spawner function spawns new process
 * @param {number} limit max number of processes
 *
 * @return new process limiter
 */
function createProcessLimiter (spawner, limit) {
  if (limit <= 0) { throw new Error('Limit can not be less or equal to 0') }

  /** @type {Map<Symbol, ChildProcess>} */
  const processes = new Map()

  /**
   * Spawns new process
   *
   * @param {T} args data to spawn process
   */
  function spawn (...args) {
    if (processes.size >= limit) { throw new Error('Can not spawn more processes than limit') }

    const
      process = spawner(...args),
      key = Symbol('')

    processes.set(key, process)

    process.on('disconnect', () => processes.delete(key))
    process.on('close', () => processes.delete(key))
    process.on('error', () => processes.delete(key))
    process.on('exit', () => processes.delete(key))
  }

  /**
   * Returns running processes count
   *
   * @return {number} running processes count
   */
  function getProcessCount () {
    return processes.size
  }

  /**
   * Returns process limit
   *
   * @return {number} limit of processes
   */
  function getProcessLimit () {
    return limit
  }

  /**
   * Returns true if another process is possible to spawn
   *
   * @return {boolean} another process is possible to spawn
   */
  function canSpawnProcess () {
    return processes.size < limit
  }

  return { spawn, canSpawnProcess, getProcessCount, getProcessLimit }
}

// SECTION Exports

module.exports = { createProcessLimiter }
