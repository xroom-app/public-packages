// SECTION Types

// MODULE Declarations

/** Event listener type */
export type Listener = (...data: ReadonlyArray<any>) => void

/** Event with listener type */
export type Event = { [EventName in string] : Listener }

// MODULE Algebras

/** Registers listener for event */
export type RegisterListener<E extends Event> = { on<T extends keyof E>(event: T, listener: E[T]): Symbol }

/** Removes event listener by symbol */
export type RemoveListener = { off(symbol: Symbol): void }

/** Emits event with data */
export type EmitEvent<E extends Event> = { emit<T extends keyof E>(event: T, ...data: Parameters<E[T]>): void }

/** Event system */
export type EventSystem<E extends Event> = RegisterListener<E> & RemoveListener & EmitEvent<E>

// SECTION Library

/** Returns new event system */
export function createEventSystem<E extends Event> (maxListeners?: number): EventSystem<E>
