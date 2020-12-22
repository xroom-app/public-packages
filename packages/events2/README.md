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

/** @template {Event} E @typedef {import('@xroom.app/events2').RegisterListener<E>} Reg */

/** @template {Event} E @typedef {import('@xroom.app/events2').EmitEvent<E>} Emit */

// SECTION Events

/** @typedef {{ roomCreated: (name: string) => void }} RoomCreated */

/** @typedef {{ roomRemoved: (name: string) => void }} RoomRemoved */

/** @typedef {{ roomsCleared: () => void }} RoomsCleared */

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

/** @typedef {import('.').EventSystem<Events>} EventSystem */

// SECTION Algebras

/** @typedef {{ addRoom: (name: string) => void }} AddRoom */

/** @typedef {{ removeRoom: (name: string) => void }} RemoveRoom */

/** @typedef {{ clearRooms: () => void }} ClearRooms */

/** @typedef {{ listRooms: () => ReadonlyArray<string> }} ListRooms */

/**
 * @typedef {(
 *  & AddRoom
 *  & RemoveRoom
 *  & ClearRooms
 *  & ListRooms
 * )} RoomRepository
 */

/** @typedef {{ log: (message: string) => void }} Log */

/** @typedef {{ getLogs: () => ReadonlyArray<string> }} GetLogs */

/**
 * @typedef {(
 *  & Log
 *  & GetLogs
 * )} TestLogger
 */

/**
 * @typedef {(
 *  & RoomRepository
 *  & TestLogger
 *  & EventSystem
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
    ...createRoomRepository(),
    ...createTestLogger(),
    ...createEventSystem()
  }
}

// SECTION Event listeners

/** @type {(P: AddRoom & Reg<RoomCreated>) => void} */
function enableRoomCreatedMutation (P) { P.on('roomCreated', P.addRoom) }

/** @type {(P: Log & Reg<RoomCreated>) => void} */
function enableRoomCreatedLogging (P) { P.on('roomCreated', name => P.log(`Created room with name '${name}'`)) }

/** @type {(P: RemoveRoom & Reg<RoomRemoved>) => void} */
function enableRoomRemovedMutation (P) { P.on('roomRemoved', P.removeRoom) }

/** @type {(P: Log & Reg<RoomRemoved>) => void} */
function enableRoomRemovedLogging (P) { P.on('roomRemoved', name => P.log(`Removed room with name '${name}'`)) }

/** @type {(P: ClearRooms & Reg<RoomsCleared>) => void} */
function enableClearedRoomsMutation (P) { P.on('roomsCleared', P.clearRooms) }

/** @type {(P: Log & Reg<RoomsCleared>) => void} */
function enableClearedRoomsLogging (P) { P.on('roomsCleared', () => P.log('Cleared all rooms')) }

/** @type {(P: Log & AddRoom & Reg<RoomCreated>) => void} */
function enableRoomCreatedListeners (P) {
  enableRoomCreatedMutation(P)
  enableRoomCreatedLogging(P)
}

/** @type {(P: Log & RemoveRoom & Reg<RoomRemoved>) => void} */
function enableRoomRemovedListeners (P) {
  enableRoomRemovedMutation(P)
  enableRoomRemovedLogging(P)
}

/** @type {(P: Log & ClearRooms & Reg<RoomsCleared>) => void} */
function enableRoomClearedListeners (P) {
  enableClearedRoomsMutation(P)
  enableClearedRoomsLogging(P)
}

/** @type {(P: Log & RoomRepository & Reg<RoomEvents>) => void} */
function enableEventListeners (P) {
  enableRoomCreatedListeners(P)
  enableRoomRemovedListeners(P)
  enableRoomClearedListeners(P)
}

// SECTION Test

const program = createTestProgram()

enableEventListeners(program)

program.emit('roomCreated', 'room1')
program.emit('roomCreated', 'room2')

console.log(program.listRooms())

program.emit('roomRemoved', 'room2')

console.log(program.listRooms())

program.emit('roomsCleared')

console.log(program.getLogs())

console.log(program.listRooms())
```
