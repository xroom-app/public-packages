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
 * Builds event listener for event data E
 *
 * @template E
 *
 * @typedef {(
 * (...data: undefined extends E ? [] : [data: E]) => void
 * )} Listener
 */

/**
 * Decreases parameter priority in type inference
 *
 * @template T
 *
 * @typedef {(
 *   [T][T extends any
 *   ? 0
 *   : never]
 * )} NoInfer
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
 * Creates new layered event system
 *
 * @template {ReadonlyArray<string>} L
 *
 * @param {string extends L[number] ? never : L} layers list of layers
 *
 * @return new layered event system
 */
function createLayeredEventSystem (layers) {
  /** @type {Map<L[number], number>} */
  const layerIndexes = new Map()

  const layersCount = layers.length

  /** @type {Array<EventEmitter>} */
  const emitters = new Array(layersCount)

  for (let i = 0; i < layersCount; i += 1) {
    layerIndexes.set(layers[i], i)
    emitters[i] = new EventEmitter()
  }

  /**
   * Executes effect each time event emit
   *
   * @template E
   *
   * @param {Event<E>} event event to subscribe
   * @param {L[number]} layer to bind effect with
   * @param {Listener<NoInfer<E>>} listener event listener
   */
  function on (event, layer, listener) {
    const layerIndex = layerIndexes.get(layer)

    if (layerIndex === undefined) {
      throw new Error(`Layer '${layer}' is not registered`)
    }

    // @ts-ignore necessary
    emitters[layerIndex].on(event.id, listener)
  }

  /**
   * Fires all event listeners of event
   *
   * @template E
   *
   * @param {Event<E>} event event to emit
   * @param {(
   * undefined extends NoInfer<E>
   *   ? []
   *   : [data: NoInfer<E>]
   * )} data data about emitted event
   */
  function emit (event, ...data) {
    for (const emitter of emitters) {
      emitter.emit(event.id, ...data)
    }
  }

  return { on, emit }
}

// SECTION Exports

module.exports = { createEvent, createLayeredEventSystem }
