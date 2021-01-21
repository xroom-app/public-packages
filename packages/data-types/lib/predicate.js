const F = require('./function')

// SECTION Types

// MODULE Declarations

/** @template {ReadonlyArray<any>} P @typedef {(...args: P) => boolean} Predicate */

/** @typedef {<P extends ReadonlyArray<any>>(pred: Predicate<P>) => Predicate<P>} PredicateOperation */

/** @typedef {<P extends ReadonlyArray<any>>(pred1: Predicate<P>, pred2: Predicate<P>) => Predicate<P>} PredicateCombinator */

// SECTION Library

/** @type {PredicateOperation} */
const not = pred => (...args) => !pred(...args)

/** @type {PredicateCombinator} */
const and = (pred1, pred2) => (...args) => pred1(...args) && pred2(...args)

/** @type {PredicateCombinator} */
const or = (pred1, pred2) => (...args) => pred1(...args) || pred2(...args)

/** @type {PredicateCombinator} */
const eq = (pred1, pred2) => (...args) => pred1(...args) === pred2(...args)

/** @type {PredicateCombinator} */
const xor = F.flow(eq, not)

/** @type {PredicateCombinator} */
const nand = F.flow(and, not)

/** @type {PredicateCombinator} */
const nor = F.flow(or, not)

// SECTION Exports

module.exports = { not, and, or, eq, xor, nand, nor }
