# Wrapper over standard nodejs events

## Installation

Run from command line

```
npm i @xroom.app/events
```

## Usage example

```js
const { createEvent, createEventSystem } = require('@xroom.app/events')

/**
 * @template T
 *
 * @typedef {import('@xroom.app/events').Event<T>} Event
 */

const events = {
    /** @type {Event<{ roomId: string, options: Record<string, any> }>} */
    roomCreated: createEvent(),
    /** @type {Event<{ roomId: string }>} */
    roomRemoved: createEvent(),
}

const eventSystem = createEventSystem(Object.values(events))

eventSystem.on(events.roomCreated, ({ roomId }) => console.log(`Created a room with id ${roomId}`))
eventSystem.on(events.roomRemoved, ({ roomId }) => console.log(`Removed a room with id ${roomId}`))

eventSystem.emit(events.roomCreated, { roomId: 'foobar', options: {} })
eventSystem.emit(events.roomRemoved, { roomId: 'foobar' })
```
