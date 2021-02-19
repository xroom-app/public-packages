import { Func } from './function'
import { Option } from './option'

// SECTION Types

/** Represents abstract predicate with parameters P */
export type Predicate<P extends ReadonlyArray<any>> = (...args: P) => boolean

/** Represents unary operation over predicate */
export type PredicateOperation = <P extends ReadonlyArray<any>>(pred: Predicate<P>) => Predicate<P>

/** Represents combinator that accepts two predicates and returns their combination */
export type PredicateCombinator = <P extends ReadonlyArray<any>>(pred1: Predicate<P>, pred2: Predicate<P>) => Predicate<P>

// SECTION Library

/** Returns negated version of predicate */
export const not: PredicateOperation

/** Returns 'and' predicate combination */
export const and: PredicateCombinator

/** Returns 'or' predicate combination */
export const or: PredicateCombinator

/** Returns 'equality' predicate combination */
export const eq: PredicateCombinator

/** Returns 'xor' predicate combination */
export const xor: PredicateCombinator

/** Returns 'nand' predicate combination */
export const nand: PredicateCombinator

/** Returns 'nor' predicate combination */
export const nor: PredicateCombinator

/** Returns some function result if predicate is true, or none otherwise */
export const then: <P extends ReadonlyArray<any>, R>(pred: Predicate<P>, func: Func<P, R>) => Func<P, Option<R>>

/** Returns first function result if predicate is true, or the second function result otherwise */
export const thenElse: <P extends ReadonlyArray<any>, R1, R2>(pred: Predicate<P>, onThen: Func<P, R1>, onElse: Func<P, R2>) => Func<P, R1 | R2>
