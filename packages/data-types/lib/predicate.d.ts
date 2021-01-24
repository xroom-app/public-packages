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
