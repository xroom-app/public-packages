/** Redis client */
type RedisClient = import('..').RedisClient

/**
 * Adds 'value' to collection 'setName'
 *
 * @param setName name of collection
 * @param value value to add
 */
type sadd = (setName: string, value: string) => Promise<void>

/**
 * Removes 'value' from collection 'setName'
 *
 * @param setName name of collection
 * @param value value to remove
 */
type srem = (setName: string, value: string) => Promise<void>

/**
 * Returns list of all elements of collection 'setName'
 *
 * @param setName name of collection
 *
 * @returns promise contains all collection elements
 */
type smembers = (setName: string) => Promise<Array<string>>

/** List of set redis methods */
type SetMethods = {
  sadd: sadd
  srem: srem
  smembers: smembers
}

/**
 * Returns list of methods to work with sets in Redis client passed
 *
 * @param clientPromise promise contains redis client
 *
 * @return list of set redis methods
 */
export function getSetRedisMethods(clientPromise): SetMethods
