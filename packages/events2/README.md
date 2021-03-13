# Wrapper over standard nodejs event emitter

## Installation

Run from command line

```
npm i @xroom.app/events2
```

## Usage example

```js
const { createEventSystem } = require('@xroom.app/events2')

// SECTION Imports

/** @typedef {import('@xroom.app/events2').Event} Event */

/** @template {Event} E @typedef {import('@xroom.app/events2').EmitEvent<E>} Emit */

/** @template {Event} E @typedef {import('@xroom.app/events2').RegisterListener<E>} Reg */

// SECTION Events

/** @typedef {{ roomsCleared: () => void }} RoomsCleared */

/** @typedef {{ roomCreated: (name: string) => void }} RoomCreated */

/** @typedef {{ roomRemoved: (name: string) => void }} RoomRemoved */

/**
 * @typedef {(
 *  & RoomCreated
 *  & RoomRemoved
 *  & RoomsCleared
 * )} RoomEvents
 */

/**
 * @typedef {(
 *  & RoomEvents
 * )} Events
 */

/** @typedef {import('@xroom.app/events2').EventSystem<Events>} EventSystem */

// SECTION Algebras

/** @typedef {{ clearRooms: () => void }} ClearRooms */

/** @typedef {{ addRoom: (name: string) => void }} AddRoom */

/** @typedef {{ removeRoom: (name: string) => void }} RemoveRoom */

/** @typedef {{ listRooms: () => ReadonlyArray<string> }} ListRooms */

/**
 * @typedef {(
 *  & AddRoom
 *  & ListRooms
 *  & ClearRooms
 *  & RemoveRoom
 * )} RoomRepository
 */

/** @typedef {{ log: (message: string) => void }} Log */

/**
 * @typedef {(
 *  & Log
 * )} Logger
 */

/**
 * @typedef {(
 *  & Logger
 *  & EventSystem
 *  & RoomRepository
 * )} Program
 */

/** @typedef {{ getLogs: () => ReadonlyArray<string> }} GetLogs */

/**
 * @typedef {(
 *  & Logger
 *  & GetLogs
 * )} TestLogger
 */

/**
 * @typedef {(
 *  & Program
 *  & TestLogger
 * )} TestProgram
 */

// SECTION Interpreters

/** @type {() => RoomRepository} */
function createRoomRepository () {
  /** @type {Set<string>} */
  const rooms = new Set()

  /** @type {AddRoom['addRoom']} */
  function addRoom (room) { rooms.add(room) }

  /** @type {RemoveRoom['removeRoom']} */
  function removeRoom (room) { rooms.delete(room) }

  /** @type {ClearRooms['clearRooms']} */
  function clearRooms () { rooms.clear() }

  /** @type {ListRooms['listRooms']} */
  function listRooms () { return Array.from(rooms) }

  return { addRoom, removeRoom, clearRooms, listRooms }
}

/** @type {() => TestLogger} */
function createTestLogger () {
  /** @type {Array<string>} */
  const logs = []

  /** @type {Log['log']} */
  function log (message) { logs.push(message) }

  /** @type {GetLogs['getLogs']} */
  function getLogs () { return logs }

  return { log, getLogs }
}

// SECTION Test program

/** @type {() => TestProgram} */
function createTestProgram () {
  return {
    ...createTestLogger(),
    ...createEventSystem(),
    ...createRoomRepository(),
  }
}

// SECTION Event listeners

/** @type {(P: Program) => void} */
function enableProgramSubscriptions (P) {
  // On room created, add room to repository
  P.on('roomCreated', P.addRoom)

  // On room removed, remove it from repository
  P.on('roomRemoved', P.removeRoom)

  // On rooms cleared, clear it in repository
  P.on('roomsCleared', P.clearRooms)
}

/** @type {(P: Reg<Events> & Log) => void} */
function enableProgramLogging (P) {
  // On room created, log a message about it
  P.on('roomCreated', name => P.log(`Created room with name '${name}'`))

  // On room removed, log a message about it
  P.on('roomRemoved', name => P.log(`Removed room with name '${name}'`))

  // On rooms are cleared, log a message about it
  P.on('roomsCleared', () => P.log('Cleared all rooms'))
}

// SECTION Test

const program = createTestProgram()

enableProgramLogging(program)

enableProgramSubscriptions(program)

program.emit('roomCreated', 'room1')
program.emit('roomCreated', 'room2')

console.log(program.listRooms())

program.emit('roomRemoved', 'room2')

console.log(program.listRooms())

program.emit('roomsCleared')

console.log(program.getLogs())

console.log(program.listRooms())
```
