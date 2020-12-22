const { createEventSystem } = require('.')

// SECTION Types

/** @typedef {{ firstEvent: (string: string) => void }} FirstEvent */

/** @typedef {{ secondEvent: (number: number) => void }} SecondEvent */

/**
 * @typedef {(
 *  & FirstEvent
 *  & SecondEvent
 * )} Events
 */

/** @typedef {import('.').EventSystem<Events>} EventSystem */

// SECTION Tests

describe('event system', () => {
  it('should call listeners in order they are registered', () => {
    /** @type {EventSystem} */
    const eventSystem = createEventSystem()

    /** @type {Array<string>} */
    const result = []

    eventSystem.on('firstEvent', data => result.push(data.toLowerCase()))

    eventSystem.on('firstEvent', data => result.push(data.toUpperCase()))

    eventSystem.emit('firstEvent', 'foo')

    expect(result).toMatchObject(['foo', 'FOO'])
  })

  it('should not emit removed event listeners', () => {
    /** @type {EventSystem} */
    const eventSystem = createEventSystem()

    /** @type {Array<string>} */
    const result = []

    const s1 = eventSystem.on('firstEvent', data => result.push(data.toLowerCase()))

    const s2 = eventSystem.on('firstEvent', data => result.push(data.toUpperCase()))

    eventSystem.emit('firstEvent', 'foo')

    eventSystem.off(s1)

    eventSystem.emit('firstEvent', 'bar')

    eventSystem.off(s2)

    eventSystem.emit('firstEvent', 'baz')

    expect(result).toMatchObject(['foo', 'FOO', 'BAR'])
  })

  it('should do nothing if remove symbol doesn\'t exist', () => {
    /** @type {EventSystem} */
    const eventSystem = createEventSystem()

    /** @type {Array<string>} */
    const result = []

    eventSystem.on('firstEvent', data => result.push(data.toLowerCase()))

    eventSystem.on('firstEvent', data => result.push(data.toUpperCase()))

    eventSystem.off(Symbol(''))

    eventSystem.emit('firstEvent', 'foo')

    expect(result).toMatchObject(['foo', 'FOO'])
  })
})
