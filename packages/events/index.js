const { EventEmitter } = require('events')

// SECTION Types

/**
 * Represents event that provides data T
 *
 * @template T
 *
 * @typedef {{ id: symbol, map?: T }} Event
 */

/**
 * Builds event listener for data T
 *
 * @template T
 *
 * @typedef {[
 *   undefined extends T
 *   ? () => void
 *   : (data: T) => void
 * ][0]} Listener
 */

/**
 * Decreases parameter priority in type inference
 *
 * @template T
 *
 * @typedef {[
 *   [T][T extends any
 *   ? 0
 *   : never]
 * ][0]} NoInfer
 */

// SECTION Library

/**
 * Creates new event
 *
 * @returns {Event<undefined>}
 */
function createEvent () {
  return { id: Symbol('') }
}

/**
 * Creates new event system
 *
 * @param {ReadonlyArray<Event<any>>} initEvents list of available events
 *
 * @return new event system
 */
function createEventSystem (initEvents) {
  const
    events = new Set(initEvents.map(e => e.id)),
    emitter = new EventEmitter()

  if (events.size !== initEvents.length) {
    throw new Error('Event duplicate passed')
  }

  /**
   * Executes listener each time event emit
   *
   * @template T
   *
   * @param {Event<T>} event event to subscribe
   * @param {Listener<T>} listener event listener
   */
  function on (event, listener) {
    if (!events.has(event.id)) {
      throw new Error('Could not add listener: event is not registered')
    }

    emitter.on(event.id, listener)
  }

  /**
   * Executes listener once on event emit
   *
   * @template T
   *
   * @param {Event<T>} event event to subscribe
   * @param {Listener<T>} listener event listener
   */
  function once (event, listener) {
    if (!events.has(event.id)) {
      throw new Error('Could not add listener: event is not registered')
    }

    emitter.once(event.id, listener)
  }

  /**
   * Executes listener asynchronously each time event emit
   *
   * @template T
   *
   * @param {Event<T>} event event to subscribe
   * @param {Listener<T>} listener event listener
   */
  function async (event, listener) {
    if (!events.has(event.id)) {
      throw new Error('Could not add listener: event is not registered')
    }

    emitter.on(event.id, (data) => setImmediate(() => listener(data)))
  }

  /**
   * Executes listener asynchronously once on event emit
   *
   * @template T
   *
   * @param {Event<T>} event event to subscribe
   * @param {Listener<T>} listener event listener
   */
  function asyncOnce (event, listener) {
    if (!events.has(event.id)) {
      throw new Error('Could not add listener: event is not registered')
    }

    emitter.once(event.id, (data) => setImmediate(() => listener(data)))
  }

  /**
   * Fires all event listeners of event
   *
   * @template T
   *
   * @param {Event<T>} event event to emit
   * @param data data about emitted event
   *
   * @type {(event: Event<T>, ...data: [
   * undefined extends NoInfer<T>
   *   ? []
   *   : [data: NoInfer<T>]
   * ][0]) => void}
   */
  function emit (event, ...data) {
    if (!events.has(event.id)) {
      throw new Error('Could not emit event: event is not registered')
    }

    emitter.emit(event.id, ...data)
  }

  return { on, once, async, asyncOnce, emit }
}

// SECTION Exports

module.exports = { createEvent, createEventSystem }
