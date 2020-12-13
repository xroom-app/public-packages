/**
 * Registers new query in repository
 *
 * @param query query to register
 *
 * @return registered query
 */
type registerQuery = <P extends ReadonlyArray<any>, R>(query: (...data: P) => Promise<R> | R) => (...data: P) => Promise<R>

/**
 * Registers new mutation in repository
 *
 * @param mutation mutation to register
 *
 * @return registered mutation
 */
type registerMutation = <P extends ReadonlyArray<any>>(mutation: (...data: P) => Promise<void>) => (...data: P) => void

/** Represents repository wrapper */
type Repository = {
  registerQuery: registerQuery
  registerMutation: registerMutation
}

/** Represents readonly repository wrapper */
type ReadonlyRepository = {
  registerQuery: registerQuery
}

/**
 * Creates new parallel repository wrapper
 *
 * @return new parallel repository
 */
export function createParallelRepository(): Repository

/**
 * Creates new serial repository wrapper
 *
 * @return new serial repository
 */
export function createSerialRepository(): Repository

/**
 * Returns a union of repositories
 *
 * @params repositories repositories to union
 *
 * @return union repository
 */
export function getRepositoryUnion(...repositories: ReadonlyArray<ReadonlyRepository>): ReadonlyRepository
