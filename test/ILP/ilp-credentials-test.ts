import { assert } from 'chai'
import IlpCredentials from '../../src/ILP/ilp-credentials'

describe('IlpCredentials Node', function(): void {
  it('Build - Undefined token', function(): void {
    // GIVEN no bearer token
    // WHEN IlpCredentials are built without a bearer token
    const credentials = IlpCredentials.build()

    // THEN credentials should have an Authorization key
    // AND it should equal 'Bearer '
    assert.equal(credentials.get('Authorization')[0], 'Bearer ')
  })

  it('Build - no prefix', function(): void {
    // GIVEN a bearer token with no "Bearer " prefix
    const bearerToken = 'password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(bearerToken)

    // THEN "Bearer " is added to token
    assert.equal(
      credentials.get('Authorization')[0],
      'Bearer '.concat(bearerToken),
    )
  })

  it('Build - with prefix', function(): void {
    // GIVEN a bearer token with a "Bearer " prefix
    const bearerToken = 'Bearer password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(bearerToken)

    // THEN bearer token is unchanged
    assert.equal(credentials.get('Authorization')[0], bearerToken)
  })
})
