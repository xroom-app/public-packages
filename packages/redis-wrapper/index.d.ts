/** Redis client */
export type RedisClient = import('redis').RedisClient

/**
 * Returns new redis client connected to database with number 'dbNumber'
 *
 * @param url url of redis database to connect
 * @param dbNumber number of database to connect
 *
 * @return new redis client connected to db with number 'dbNumber'
 */
export function getRedisClient(url: string, dbNumber: number): Promise<RedisClient>
