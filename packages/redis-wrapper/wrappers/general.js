/**
 * Returns list of general methods to work with Redis client passed
 *
 * @param {Promise<import('redis').RedisClient>} clientPromise promise contains redis client
 *
 * @return list of general redis methods
 */
function getGeneralRedisMethods (clientPromise) {
  /**
   * Removes root redis collection
   *
   * @param {string} collectionName name of collection to remove
   */
  async function del (collectionName) {
    const client = await clientPromise

    await new Promise(resolve => client.del(collectionName, resolve))
  }

  /**
   * Returns names of all root db collections starting with prefix
   *
   * @param {string} [prefix] prefix of the collection names to get
   *
   * @returns {Promise<Array<string>>} promise contains matching collection names
   */
  async function keys (prefix) {
    const
      client = await clientPromise,
      pref = `${prefix !== undefined ? prefix : ''}*`

    return new Promise(resolve => client.keys(pref, (_, res) => resolve(res)))
  }

  return { del, keys }
}

module.exports = { getGeneralRedisMethods }
