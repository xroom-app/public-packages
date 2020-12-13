/** Redis client */
type RedisClient = import('..').RedisClient

/**
 * Removes root redis collection
 *
 * @param collectionName name of collection to remove
 */
type del = (collectionName: string) => Promise<void>

/**
 * Returns names of all root db collections starting with prefix
 *
 * @param prefix prefix of the collection names to get
 *
 * @returns promise contains matching collection names
 */
type keys = (prefix?: string) => Promise<Array<string>>

/** List of general redis methods */
type GeneralMethods = {
  del: del
  keys: keys
}

/**
 * Returns list of general methods to work with Redis client passed
 *
 * @param clientPromise promise contains redis client
 *
 * @return list of general redis methods
 */
export function getGeneralRedisMethods(clientPromise: Promise<RedisClient>): GeneralMethods
