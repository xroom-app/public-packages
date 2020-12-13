/** Decreases parameter priority in type inference */
type NoInfer<T> = [T][T extends any ? 0 : never]

/** Builds event listener for event data  */
type Listener<E> = (...data: [E] extends [never] ? [] : [data: E]) => void

/**
 * Executes effect each time event emit
 *
 * @param event event to subscribe
 * @param layer to run event on
 * @param listener mutation event listener
 */
type on<L extends string> = <E>(event: Event<E>, layer: L, listener: Listener<NoInfer<E>>) => void

/**
 * Fires all event listeners of event
 *
 * @param event event to emit
 * @param data data about emitted event
 */
type emit = <E>(event: Event<E>, ...data: [NoInfer<E>] extends [never] ? [] : [data: NoInfer<E>]) => void

/** Represents event that provides data T */
export type Event<E> = { id: symbol, map?: E }

/** Represents event system */
export type LayeredEventSystem<L extends string> = {
  on: on<L>
  emit: emit
}

/**
 * Creates new event
 */
export function createEvent<T = never>(): Event<T>

/**
 * Creates new layered event system
 *
 * @return new layered event system
 */
export function createLayeredEventSystem<L extends ReadonlyArray<string>>(layers: string extends L[number] ? never : L): LayeredEventSystem<L[number]>
