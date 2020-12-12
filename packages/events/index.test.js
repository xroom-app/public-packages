const { createEvent, createEventSystem } = require('.')

// SECTION Types

/** @template T @typedef {import('.').Event<T>} Event */

// SECTION Constants

const events = {
  /** @type {Event<string>} */
  a: createEvent(),
  /** @type {Event<number>} */
  b: createEvent()
}

// SECTION Library

/** @type {() => undefined} */
const noop = () => undefined

/** @type {() => Promise<void>} */
const immediateTasks = () => new Promise(resolve => setTimeout(resolve, 0))

// SECTION Tests

describe('noop function', () => {
  it('should always return undefined', () => {
    expect(noop()).toBeUndefined()
  })
})

describe('immediateTasks function', () => {
  it('should await immediate tasks', async () => {
    /** @type {Array<number>} */
    const result = []

    Promise.resolve(5).then(n => result.push(n))

    expect(result).toMatchObject([])

    await immediateTasks()

    expect(result).toMatchObject([5])
  })
})

describe('event system package', () => {
  it('should not allow register duplicate events', () => {
    const c = createEvent()

    expect(() => createEventSystem([c, c])).toThrow('Event duplicate passed')
  })

  it('should only allow register listeners for registered events', () => {
    const c = createEvent()

    const eventSystem = createEventSystem(Object.values(events))

    expect(() => eventSystem.on(c, noop)).toThrow('Could not add listener: event is not registered')
    expect(() => eventSystem.once(c, noop)).toThrow('Could not add listener: event is not registered')
    expect(() => eventSystem.async(c, noop)).toThrow('Could not add listener: event is not registered')
    expect(() => eventSystem.asyncOnce(c, noop)).toThrow('Could not add listener: event is not registered')
  })

  it('should allow emitting only registered events', () => {
    const c = createEvent()

    const eventSystem = createEventSystem(Object.values(events))

    expect(() => eventSystem.emit(c)).toThrow('Could not emit event: event is not registered')
  })

  it('should do nothing if event has no listeners', () => {
    const eventSystem = createEventSystem(Object.values(events))

    expect(eventSystem.emit(events.a, '')).toBeUndefined()
  })

  it('should call listeners in order they are registered', () => {
    const eventSystem = createEventSystem(Object.values(events))

    /** @type {Array<string>} */
    const result = []

    eventSystem.on(events.a, data => result.push(data.toLowerCase()))

    eventSystem.on(events.a, data => result.push(data.toUpperCase()))

    eventSystem.emit(events.a, 'foo')

    expect(result).toMatchObject(['foo', 'FOO'])
  })

  it('should not call events registered with once method twice', () => {
    const eventSystem = createEventSystem(Object.values(events))

    /** @type {Array<string>} */
    const result = []

    eventSystem.on(events.a, data => result.push(data.toLowerCase()))

    eventSystem.once(events.a, data => result.push(data.toUpperCase()))

    eventSystem.emit(events.a, 'foo')
    eventSystem.emit(events.a, 'foo')

    expect(result).toMatchObject(['foo', 'FOO', 'foo'])
  })

  it('should call async listeners after synchronous', async () => {
    const eventSystem = createEventSystem(Object.values(events))

    /** @type {Array<string>} */
    const result = []

    eventSystem.async(events.a, data => result.push(data.toLowerCase()))
    eventSystem.on(events.a, data => result.push(data.toUpperCase()))

    eventSystem.emit(events.a, 'foo')

    expect(result).toMatchObject(['FOO'])

    await immediateTasks()

    expect(result).toMatchObject(['FOO', 'foo'])
  })

  it('should not call asyncOnce listeners twice', async () => {
    const eventSystem = createEventSystem(Object.values(events))

    /** @type {Array<string>} */
    const result = []

    eventSystem.asyncOnce(events.a, data => result.push(data.toLowerCase()))
    eventSystem.on(events.a, data => result.push(data.toUpperCase()))

    eventSystem.emit(events.a, 'foo')
    eventSystem.emit(events.a, 'foo')

    expect(result).toMatchObject(['FOO', 'FOO'])

    await immediateTasks()

    expect(result).toMatchObject(['FOO', 'FOO', 'foo'])
  })
})
