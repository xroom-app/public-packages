# Wrapper over redis package

## Installation

Run from command line

```
npm i @xroom.app/redis-wrapper
```

## Usage example

```js
const { getGeneralRedisMethods, getHashMapRedisMethods } = require('@xroom.app/redis-wrapper/wrappers')
const { getRedisClient } = require('@xroom.app/redis-wrapper')

const url = 'redis://127.0.0.1:6379'
const dbNumber = 0

const clientPromise = getRedisClient(url, dbNumber)

const generalMethods = getGeneralRedisMethods(clientPromise)

const hashMapMethods = getHashMapRedisMethods(clientPromise)

const runTask = (async () => {
  await hashMapMethods.hset('myMap', 'foo', 'bar')

  const keys = await generalMethods.keys('my')

  console.log(keys.includes('myMap'))
})

runTask()
```
