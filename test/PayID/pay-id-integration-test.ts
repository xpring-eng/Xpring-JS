import { assert } from 'chai'
import PayIDClient from '../../src/PayID/pay-id-client'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A Pay ID that will resolve.
const payID = '$doug.purdy.im'

// A PayIDClient under test.
const payIDClient = new PayIDClient()

describe('PayID Integration Tests', function(): void {
  it('Resolve PayID to XRP', async function(): Promise<void> {
    this.timeout(timeoutMs)

    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)
    console.log(xrpAddress)
    assert.exists(xrpAddress)
  })
})
