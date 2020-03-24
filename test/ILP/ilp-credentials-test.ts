import { assert } from 'chai'
import { fail } from 'assert'
import IlpCredentials from '../../src/ILP/auth/ilp-credentials'

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
    const accessToken = 'password'

    // WHEN IlpCredentials are built
    const credentials = IlpCredentials.build(accessToken)

    // THEN "Bearer " is added to token
    assert.equal(
      credentials.get('Authorization')[0],
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
      // THEN an Error is thrown
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        'Access token should not start with "Bearer "',
      )
    }
  })
})
