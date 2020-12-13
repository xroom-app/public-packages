/** Redis client */
type RedisClient = import('..').RedisClient

/**
 * Assigns 'value' to key 'key' in collection 'mapName'
 *
 * @param mapName name of collection
 * @param key key to assign value to
 * @param value value to set
 */
type hset = (mapName: string, key: string, value: string) => Promise<void>

/**
 * Removes member 'key' from collection 'mapName'
 *
 * @param mapName name of collection
 * @param key key of value to remove
 */
type hdel = (mapName: string, key: string) => Promise<void>

/**
 * Returns value with key 'key' from collection 'mapName'
 *
 * @param mapName name of collection
 * @param key key to return value of
 *
 * @returns value assigned to key 'key'
 */
type hget = (mapName: string, key: string) => Promise<string>

/**
 * Returns all keys and values from collection 'mapName'
 *
 * @param mapName name of collection
 *
 * @returns all keys and values
 */
type hgetall = (mapName: string) => Promise<Record<string, string>>

/** List of hashmap redis methods */
type HashMapMethods = {
  hset: hset
  hdel: hdel
  hget: hget
  hgetall: hgetall
}

/**
 * Returns list of methods to work with hash maps in Redis client passed
 *
 * @param clientPromise promise contains redis client
 *
 * @return list of hashMap redis methods
 */
export function getHashMapRedisMethods(clientPromise: Promise<RedisClient>): HashMapMethods
