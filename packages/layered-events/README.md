# Event system with layers

## This package is deprecated and will be deleted soon

## Installation

Run from command line

```
npm i @xroom.app/layered-events
```

## Usage example

```js
const { createEvent, createLayeredEventSystem } = require('@xroom.app/layered-events')

// SECTION Types

/** @template T @typedef {import('@xroom.app/layered-events').Event<T>} Event */

// SECTION Constants

/** Time which rooms will live before removal */
const watchDogTimeout = 5 * 1000

// SECTION State

/** @type {Map<string, { roomId: string, capacity: number }>} */
const roomStorage = new Map()

/** @type {Map<string, NodeJS.Timeout>} */
const roomWatchdogs = new Map()

// SECTION Layers

/**
 * @type {[
  * 'mutations',
  * 'logging',
  * 'extensions',
  * ]}
  */
const layers = [
  'mutations',
  'logging',
  'extensions',
]

// SECTION Events

const events = {
  /** @type {Event<{ roomId: string, capacity: number }>} */
  roomCreated: createEvent(),
  /** @type {Event<{ roomId: string }>} */
  roomRemoved: createEvent(),
  /** @type {Event<{ roomId: string, timer: NodeJS.Timeout, timeout: number }>} */
  watchDogAdded: createEvent(),
  /** @type {Event<{ roomId: string }>} */
  watchDogFired: createEvent(),
  /** @type {Event<{ roomId: string }>} */
  watchDogRemoved: createEvent(),
}

const eventSystem = createLayeredEventSystem(layers)

// SECTION Bindings

// MODULE Mutations

// On room created, add it to the state
eventSystem.on(events.roomCreated, 'mutations', ({ roomId, capacity }) => roomStorage.set(roomId, { roomId, capacity }))

// On room removed, remove it from the state
eventSystem.on(events.roomRemoved, 'mutations', ({ roomId }) => roomStorage.delete(roomId))

// On room watchdog added, add it to the state
eventSystem.on(events.watchDogAdded, 'mutations', ({ roomId, timer }) => roomWatchdogs.set(roomId, timer))

// On watchdog removed, remove it from the state
eventSystem.on(events.watchDogRemoved, 'mutations', ({ roomId }) => roomWatchdogs.delete(roomId))

// MODULE Logging

// On room created, write a message about it in the console
eventSystem.on(events.roomCreated, 'logging', ({ roomId, capacity }) => console.log(`created a room with id '${roomId}' and capacity ${capacity}`))

// On room removed, write a message about it in the console
eventSystem.on(events.roomRemoved, 'logging', ({ roomId }) => console.log(`removed the room with id '${roomId}'`))

// On watchdog added, write a message about it in the console
eventSystem.on(events.watchDogAdded, 'logging', ({ roomId, timeout }) => console.log(`Added ${timeout / 1000} seconds watchdog for the room '${roomId}'`))

// On watchdog removed, write a message about it in the console
eventSystem.on(events.watchDogRemoved, 'logging', ({ roomId }) => console.log(`Removed a watchdog for the room '${roomId}'`))

// On watchdog fired, write a message about it in the console
eventSystem.on(events.watchDogFired, 'logging', ({ roomId }) => console.log(`Fired a watchdog for the room '${roomId}'`))

// MODULE extensions

// On room created, add a watchdog for it
eventSystem.on(events.roomCreated, 'extensions', ({ roomId }) => addRoomWatchDog(roomId, watchDogTimeout))

// On watchdog fired, remove the room it assigned to
eventSystem.on(events.watchDogFired, 'extensions', ({ roomId }) => removeRoom(roomId))

// On watchdog fired, run a command that removes it
eventSystem.on(events.watchDogFired, 'extensions', ({ roomId }) => removeRoomWatchDog(roomId))

// SECTION Commands

/**
 * Creates a new room
 *
 * @param {string} roomId id of the room
 * @param {number} capacity room capacity
 */
function createRoom (roomId, capacity) {
  eventSystem.emit(events.roomCreated, { roomId, capacity })
}

/**
 * Removes an existing room
 *
 * @param {string} roomId id of the room
 */
function removeRoom (roomId) {
  eventSystem.emit(events.roomRemoved, { roomId })
}

/**
 * Fires room watchdog
 *
 * @param {string} roomId id of the room
 */
function fireRoomWatchDog (roomId) {
  eventSystem.emit(events.watchDogFired, { roomId })
}

/**
 * Adds a new room watchdog
 *
 * @param {string} roomId id of the room
 * @param {number} timeout watchdog timeout
 */
function addRoomWatchDog (roomId, timeout) {
  const timer = setTimeout(() => fireRoomWatchDog(roomId), timeout)

  eventSystem.emit(events.watchDogAdded, { roomId, timer, timeout })
}

/**
 * Removes room watchdog
 *
 * @param {string} roomId id of the room
 */
function removeRoomWatchDog (roomId) {
  eventSystem.emit(events.watchDogRemoved, { roomId })
}

// SECTION Application

createRoom('xroom-app-room', 10)
```
