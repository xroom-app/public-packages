/**
 * Returns list of methods to work with hash maps in Redis client passed
 *
 * @param {Promise<import('redis').RedisClient>} clientPromise promise contains redis client
 *
 * @return list of hashMap redis methods
 */
function getHashMapRedisMethods (clientPromise) {
  /**
   * Assigns 'value' to key 'key' in collection 'mapName'
   *
   * @param {string} mapName name of collection
   * @param {string} key key to assign value to
   * @param {string} value value to set
   */
  async function hset (mapName, key, value) {
    const client = await clientPromise

    await new Promise(resolve => client.hset(mapName, key, value, resolve))
  }

  /**
   * Removes member 'key' from collection 'mapName'
   *
   * @param {string} mapName name of collection
   * @param {string} key key of value to remove
   */
  async function hdel (mapName, key) {
    const client = await clientPromise

    await new Promise(resolve => client.hdel(mapName, key, resolve))
  }

  /**
   * Returns value with key 'key' from collection 'mapName'
   *
   * @param {string} mapName name of collection
   * @param {string} key key to return value of
   *
   * @returns {Promise<string>} value assigned to key 'key'
   */
  async function hget (mapName, key) {
    const client = await clientPromise

    return new Promise(resolve => client.hget(mapName, key, (_, res) => resolve(res)))
  }

  /**
   * Returns all keys and values from collection 'mapName'
   *
   * @param {string} mapName name of collection
   *
   * @returns {Promise<Record<string, string>>} all keys and values
   */
  async function hgetall (mapName) {
    const client = await clientPromise

    return new Promise(resolve => client.hgetall(mapName, (_, res) => resolve(res)))
  }

  return { hset, hdel, hget, hgetall }
}

module.exports = { getHashMapRedisMethods }
