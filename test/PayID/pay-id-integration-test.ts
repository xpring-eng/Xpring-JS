import { assert } from 'chai'
import PayIDClient from '../../src/PayID/pay-id-client'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A PayIDClient under test.
const payIDClient = new PayIDClient()

describe('PayID Integration Tests', function(): void {
  it('Resolve PayID to XRP - known PayID', async function(): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payID = '$doug.purdy.im'

    // WHEN it is resolved to an XRP address
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address exists.
    assert.exists(xrpAddress)
  })

  // TODO(keefertaylor): Add a test for a PayID mapping which doesn't exist. https://doug.purdy.im returns 403 errors for paths which
  // do not exist, rather than 404s.
})
