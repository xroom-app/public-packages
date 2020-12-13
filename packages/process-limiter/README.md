# Simple node process limiter

## Installation

Run from command line

```
npm i @xroom.app/process-limiter
```

## Usage example

### process.js

```js
if (process.argv.length < 5) { process.exit(0) }

const processNumber = process.argv[2]

const timeout1 = Number.parseInt(process.argv[3], 10)
const timeout2 = Number.parseInt(process.argv[4], 10)

console.log(`Process ${processNumber} message 1`)

setTimeout(() => console.log(`Process ${processNumber} message 2`), timeout1)

setTimeout(() => console.log(`Process ${processNumber} message 3`), timeout2)
```

### app.js

```js
const { createProcessLimiter } = require('@xroom.app/process-limiter')
const { exec } = require('child_process')

/**
 * Spawns a process with number 'number'
 *
 * @param {number} number number of the process
 * @param {number} timeout1 timeout till second message
 * @param {number} timeout2 timeout till third message
 *
 * @return new process with number 'number'
 */
function spawnProcess (number, timeout1, timeout2) {
  const process = exec(`node process.js ${number} ${timeout1} ${timeout2}`)

  process.stdout?.on('data', console.log)

  return process
}


const processLimit = 2

const processLimiter = createProcessLimiter(spawnProcess, processLimit)


// Finishes in 4 seconds after app starts
setTimeout(() => { if (processLimiter.canSpawnProcess()) { processLimiter.spawn(1, 2000, 4000) } }, 0)

// Finishes in 3 seconds after app starts
setTimeout(() => { if (processLimiter.canSpawnProcess()) { processLimiter.spawn(2, 1000, 3000) } }, 0)

// Will not be spawned because 2 processes already exist
setTimeout(() => { if (processLimiter.canSpawnProcess()) { processLimiter.spawn(3, 1000, 2000) } }, 2000)

// Will be spawned because the second process is finished
setTimeout(() => { if (processLimiter.canSpawnProcess()) { processLimiter.spawn(4, 0, 0) } }, 3500)
```

### app.js output

```
Process 1 message 1
Process 2 message 1
Process 2 message 2
Process 1 message 2
Process 2 message 3
Process 4 message 1
Process 4 message 2
Process 4 message 3
Process 1 message 3
```
