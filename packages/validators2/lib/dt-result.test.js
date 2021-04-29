const { chain, map } = require('./dt-result').validatorDataType
const R = require('@xroom.app/data-types/lib/result')
const T = require('./basic-result').basicValidators

// SECTION utils

/** @type {(string: string) => number} */
function length (string) { return string.length }

/** @type {<T extends { length: number }>(container: T) => R.Result<T>} */
const nonEmpty = container => container.length === 0 ? R.err : R.ok(container)

// SECTION Tests

describe('map function', () => {
  it('should return mapped value if validator passed', () => {
    expect(map(T.string, length)('01234')).toMatchObject(R.ok(5))
  })

  it('should return error if validator doesn\'t passed', () => {
    expect(map(T.string, length)(0)).toMatchObject(R.err)
  })
})

describe('chain function', () => {
  it('should return data if it matches both validators', () => {
    expect(chain(T.array(T.number), nonEmpty)([0])).toMatchObject(R.ok([0]))
  })

  it('should apply main validator checks first', () => {
    expect(chain(T.array(T.number), nonEmpty)(3)).toMatchObject(R.err)

    expect(chain(T.array(T.number), nonEmpty)([''])).toMatchObject(R.err)
  })

  it('should return error if data matches validator, but not extension', () => {
    expect(chain(T.array(T.number), nonEmpty)([])).toMatchObject(R.err)
  })
})
