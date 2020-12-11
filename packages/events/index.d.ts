/** Builds event listener for data T */
type Listener<T> = [T] extends [never] ? (() => void) : ((data: T) => void)

/** Decreases parameter priority in type inference */
type NoInfer<T> = [T][T extends any ? 0 : never]

/**
 * Executes listener each time event emit
 *
 * @param event event to subscribe
 * @param listener event listener
 */
type on = <T>(event: Event<T>, listener: Listener<NoInfer<T>>) => void

/**
 * Executes listener once on event emit
 *
 * @param event event to subscribe
 * @param listener event listener
 */
type once = <T>(event: Event<T>, listener: Listener<NoInfer<T>>) => void

/**
 * Executes listener asynchronously each time event emit
 *
 * @param event event to subscribe
 * @param listener event listener
 */
type async = <T>(event: Event<T>, listener: Listener<NoInfer<T>>) => void

/**
 * Executes listener asynchronously once on event emit
 *
 * @param event event to subscribe
 * @param listener event listener
 */
type asyncOnce = <T>(event: Event<T>, listener: Listener<NoInfer<T>>) => void

/**
 * Fires all event listeners of event
 *
 * @param event event to emit
 * @param data data about emitted event
 */
type emit = <T>(event: Event<T>, ...data: [NoInfer<T>] extends [never] ? [] : [data: NoInfer<T>]) => void

/** Represents event that provides data T */
export type Event<T> = { id: symbol, map?: T }

/** Represents event system */
export type EventSystem = {
  on: on
  once: once
  async: async
  asyncOnce: asyncOnce
  emit: emit
}

/**
 * Creates new event
 */
export function createEvent<T = never>(): Event<T>

/**
 * Creates new event system
 *
 * @param initEvents initial list of available events
 *
 * @return new event system
 */
export function createEventSystem(initEvents: ReadonlyArray<Event<any>>): EventSystem
