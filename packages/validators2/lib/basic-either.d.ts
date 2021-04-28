import { Either } from '@xroom.app/data-types/lib/either'
import { BasicValidators } from './basic-alg'
import { ValidateError } from './errors'

// SECTION Types

/** Represents result of either validator */
export type ValidationResult$either<T> = Either<ReadonlyArray<ValidateError>, T>

// SECTION Constants

/** All basic either validators */
export const basicValidators$either: BasicValidators<'either'>
