# Wrapper synchronizing repository mutations

## Installation

Run from command line

```
npm i @xroom.app/repository-wrapper
```

## Usage example

```js
const { createParallelRepository, createSerialRepository, getRepositoryUnion } = require('@xroom.app/repository-wrapper')


/** @type {(time: number) => Promise<void> } */
function sleep (time) { return new Promise(resolve => setTimeout(resolve, time)) }


let data1 = 0
let data2 = 0


// Queries can be either synchronous or asynchronous

/** @type {(number: number) => Promise<number> } */
function _getData1Plus (number) { return Promise.resolve(data1 + number) }

/** @type {(number: number) => Promise<number> } */
function _getData2Plus (number) { return Promise.resolve(data2 + number) }

/** @type {() => number} */
function _getDataSum () { return data1 + data2 }


// Mutations must be asynchronous or they should not be registered

/** @type {(value: number, timeout: number) => Promise<void>} */
function _setData1 (value, timeout) { return sleep(timeout).then(() => { data1 = value }) }

/** @type {(value: number, timeout: number) => Promise<void>} */
function _setData2 (value, timeout) { return sleep(timeout).then(() => { data2 = value }) }


// Parallel repository runs mutations in parallel

const repository1 = createParallelRepository()

const getData1Plus = repository1.registerQuery(_getData1Plus)

const setData1 = repository1.registerMutation(_setData1)


// Serial repository runs mutations in sequence

const repository2 = createSerialRepository()

const getData2Plus = repository2.registerQuery(_getData2Plus)

const setData2 = repository2.registerMutation(_setData2)


// Union repository waits for all repository mutations to be ended

const repositoryUnion = getRepositoryUnion(repository1, repository2)

const getDataSum = repositoryUnion.registerQuery(_getDataSum)


// Parallel mutations

setData1(0, 1000)
setData1(1, 2000)
// Writes '3' in 2 seconds
getData1Plus(2).then(console.log)
setData1(2, 3000)
setData1(3, 4000)
setData1(4, 5000)
// Writes '14' in 5 seconds
getData1Plus(10).then(console.log)


// Serial mutations

setData2(0, 1000)
setData2(1, 2000)
// Writes '2' in 3 seconds
getData2Plus(1).then(console.log)
setData2(11, 3000)


// Repository union

// Writes '15' in 6 seconds
// as a combination of
// setData1(4, 5000) and
// setData2(.., 1000) +
// setData2(.., 2000) +
// setData2(11, 3000) = 6000
getDataSum().then(console.log)
```
