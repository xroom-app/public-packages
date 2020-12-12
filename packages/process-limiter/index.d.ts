type ChildProcess = import('child_process').ChildProcess

/**
 * Spawns new process
 *
 * @param args data to spawn process
 *
 * @return key to get process
 */
type spawn<T extends ReadonlyArray<any>> = (...args: T) => void

/**
 * Returns true if another process is possible to spawn
 *
 * @return another process is possible to spawn
 */
type canSpawnProcess = () => boolean

/**
 * Returns running processes count
 *
 * @return running processes count
 */
type getProcessCount = () => number

/**
 * Returns process limit
 *
 * @return limit of processes
 */
type getProcessLimit = () => number

/** Represents process limiter */
type ProcessLimiter<T extends ReadonlyArray<any>> = {
  spawn: spawn<T>
  canSpawnProcess: canSpawnProcess
  getProcessCount: getProcessCount
  getProcessLimit: getProcessLimit
}

/** Function spawns new child process */
type ProcessSpawner<T extends ReadonlyArray<any>> = (...args: T) => ChildProcess

/**
 * Creates new process limiter
 *
 * @param spawner function spawns new process
 * @param limit max number of processes
 *
 * @return new process limiter
 */
export function createProcessLimiter<T extends ReadonlyArray<any>>(spawner: ProcessSpawner<T>, limit: number): ProcessLimiter<T>
