import { assert } from 'chai'
import PayIDCLient from '../src/pay-id-client'

// A fake authorization token for the PayID service.
const payIDAuthorizationToken = 'abc123'

describe('PayID Client', function(): void {
  it('isAuthorized - authorized client', function() {
    // GIVEN an authorized payID client.
    const payIDClient = new PayIDCLient(payIDAuthorizationToken)

    // WHEN the client is asked if it is authorized to update pointers.
    const isAuthorized = payIDClient.isAuthorizedForUpdates()

    // THEN the client reports that it is authorized.
    assert.isTrue(isAuthorized)
  })

  it('isAuthorized - unauthorized client', function() {
    // GIVEN an unauthorized payID client.
    const payIDClient = new PayIDCLient(undefined)

    // WHEN the client is asked if it is authorized to update pointers.
    const isAuthorized = payIDClient.isAuthorizedForUpdates()

    // THEN the client reports that it is not authorized.
    assert.isFalse(isAuthorized)
  })

  // TODO(keefertaylor): Add additional tests for PayID client when functionality is implemented.
})
