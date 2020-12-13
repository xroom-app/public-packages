/**
 * Returns list of methods to work with sets in Redis client passed
 *
 * @param {Promise<import('redis').RedisClient>} clientPromise promise contains redis client
 *
 * @return list of set redis methods
 */
function getSetRedisMethods (clientPromise) {
  /**
   * Adds 'value' to collection 'setName'
   *
   * @param {string} setName name of collection
   * @param {string} value value to add
   */
  async function sadd (setName, value) {
    const client = await clientPromise

    await new Promise(resolve => client.sadd(setName, value, resolve))
  }

  /**
   * Removes 'value' from collection 'setName'
   *
   * @param {string} setName name of collection
   * @param {string} value value to remove
   */
  async function srem (setName, value) {
    const client = await clientPromise

    await new Promise(resolve => client.srem(setName, value, resolve))
  }

  /**
   * Returns list of all elements of collection 'setName'
   *
   * @param {string} setName name of collection
   *
   * @returns {Promise<Array<string>>} promise contains all collection elements
   */
  async function smembers (setName) {
    const client = await clientPromise

    return new Promise(resolve => client.smembers(setName, (_, res) => resolve(res)))
  }

  return { sadd, srem, smembers }
}

module.exports = { getSetRedisMethods }
