import { assert } from 'chai'
import { fail } from 'assert'
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
    const accessToken = 'password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(accessToken)

    // THEN "Bearer " is added to token
    assert.equal(
      credentials && credentials.Authorization,
      'Bearer '.concat(accessToken),
    )
  })

  it('Build - with prefix', function(): void {
    // GIVEN a bearer token with a "Bearer " prefix
    const accessToken = 'Bearer password'

    // WHEN IlpCredentials are built
    try {
      IlpCredentials.build(accessToken)
      fail()
    } catch (error) {
      // THEN and Error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        'Access token should not start with "Bearer "',
      )
    }
  })
})
