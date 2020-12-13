const redis = require('redis')

/**
 * Returns new redis client connected to database with number 'dbNumber'
 *
 * @param {string} url url of redis database to connect
 * @param {number} dbNumber number of database to connect
 *
 * @return {Promise<redis.RedisClient>} new redis client connected to db with number 'dbNumber'
 */
async function getRedisClient (url, dbNumber) {
  const client = redis.createClient(`${url}/${dbNumber}`)

  await new Promise(resolve => {
    client.on('connect', resolve)

    client.on('error', error => {
      console.log('Redis error:', error)
      process.exit(-1)
    })
  })

  return client
}

module.exports = { getRedisClient }
