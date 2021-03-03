const { EventEmitter } = require('events')

// SECTION Types

/**
 * Event listener type
 *
 * @typedef {(...data: ReadonlyArray<any>) => void} Listener
 */

/**
 * Event with listener type
 *
 * @typedef {{ [EventName in string] : Listener }} Event
 */

/**
 * Registers listener for event
 *
 * @template {Event} E
 *
 * @typedef {{ on<T extends keyof E>(event: T, listener: E[T]): Symbol }} RegisterListener
 */

/**
 * Removes event listener by symbol
 *
 * @typedef {{ off(symbol: Symbol): void }} RemoveListener
 */

/**
 * Emits event with data
 *
 * @template {Event} E
 *
 * @typedef {{ emit<T extends keyof E>(event: T, ...data: Parameters<E[T]>): void }} EmitEvent
 */

/**
 * Event system
 *
 * @template {Event} E
 *
 * @typedef {(
 *  & RegisterListener<E>
 *  & RemoveListener
 *  & EmitEvent<E>
 * )} EventSystem
 */

// SECTION Library

/**
 * Returns new event system
 *
 * @template {Event} E
 *
 * @param {number} [maxListeners] maximal listeners
 *
 * @return {EventSystem<E>}
 */
function createEventSystem (maxListeners) {
  const emitter = new EventEmitter()

  if (maxListeners !== undefined) {
    emitter.setMaxListeners(maxListeners)
  }

  /** @type {Map<Symbol, { [T in keyof E]: E[T] }>} */
  const removeEvents = new Map()

  /**
   * Registers new listener for event
   *
   * @template {keyof E} T
   *
   * @param {T} event event register to
   * @param {E[T]} listener listener to register
   *
   * @return {Symbol} symbol to remove listener
   */
  function on (event, listener) {
    emitter.on(event, listener)

    const symbol = Symbol('')

    // @ts-ignore https://github.com/microsoft/TypeScript/issues/42076
    removeEvents.set(symbol, { [event]: listener })

    return symbol
  }

  /**
   * Removes listener by symbol
   *
   * @param {Symbol} symbol
   */
  function off (symbol) {
    const listener = removeEvents.get(symbol)

    if (listener === undefined) { return }

    for (const key of Object.keys(listener)) {
      emitter.off(key, listener[key])
    }
  }

  /**
   * Emits listeners for event
   *
   * @template {keyof E} T
   *
   * @param {T} event event to emit
   * @param {Parameters<E[T]>} data event data
   */
  function emit (event, ...data) {
    emitter.emit(event, ...data)
  }

  return { on, off, emit }
}

// SECTION Exports

module.exports = { createEventSystem }
