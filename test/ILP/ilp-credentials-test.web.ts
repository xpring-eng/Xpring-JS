import { assert } from 'chai'
import IlpCredentials from '../../src/ILP/auth/ilp-credentials.web'

describe('IlpCredentials Web', function(): void {
  it('Build - Undefined token', function(): void {
    // GIVEN no bearer token
    // WHEN IlpCredentials are built without a bearer token
    const credentials = IlpCredentials.build()

    // THEN credentials should be undefined
    assert(!credentials)
  })

  it('Build - no prefix', function(): void {
    // GIVEN a bearer token with no "Bearer " prefix
    const bearerToken = 'password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(bearerToken)

    // THEN "Bearer " is added to token
    assert.equal(
      credentials && credentials.Authorization,
      'Bearer '.concat(bearerToken),
    )
  })

  it('Build - with prefix', function(): void {
    // GIVEN a bearer token with a "Bearer " prefix
    const bearerToken = 'Bearer password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(bearerToken)

    // THEN bearer token is unchanged
    assert.equal(credentials && credentials.Authorization, bearerToken)
  })
})
