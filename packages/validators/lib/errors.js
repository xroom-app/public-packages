const { getTypeOf } = require('./util')

// SECTION Types

/** @typedef {{ __tag: 'not-found' }} NotFoundError */

/** @typedef {{ __tag: 'field', field: string }} FieldError */

/** @typedef {{ __tag: 'type', expected: string, got: string }} TypeError */

/** @typedef {{ __tag: 'condition', condition: string, value: unknown }} ConditionError */

/** @typedef {{ __tag: 'container', container: string, dimensions: number }} ContainerError */

/** @typedef {NotFoundError | TypeError | FieldError | ConditionError | ContainerError} ValidateError */

// SECTION Constants

/** @type {NotFoundError['__tag']} */
const notFoundTag = 'not-found'

/** @type {FieldError['__tag']} */
const fieldTag = 'field'

/** @type {TypeError['__tag']} */
const typeTag = 'type'

/** @type {ConditionError['__tag']} */
const conditionTag = 'condition'

/** @type {ContainerError['__tag']} */
const containerTag = 'container'

// SECTION Library

/** @type {ValidateError} */
const notFound = { __tag: notFoundTag }

/** @type {(field: string) => ValidateError} */
const fieldError = field => ({ __tag: fieldTag, field })

/** @type {(expected: string, data: unknown) => ValidateError} */
const typeError = (expected, data) => ({ __tag: typeTag, expected, got: getTypeOf(data) })

/** @type {(condition: string, value: unknown) => ValidateError} */
const conditionError = (condition, value) => ({ __tag: conditionTag, condition, value })

/** @type {(container: string, dimensions: number) => ValidateError} */
const containerError = (container, dimensions) => ({ __tag: containerTag, container, dimensions })

// SECTION Exports

module.exports = { notFound, fieldError, typeError, conditionError, containerError }
