import { assert } from 'chai'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'
import PayIDClient, { XRPLNetwork } from '../../src/PayID/pay-id-client'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

// A PayIDClient under test.
const payIDClient = new PayIDClient()

describe('PayID Integration Tests', function(): void {
  it('Resolve PayID to XRP - known PayID - mainnet', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN it is resolved to an XRP address on mainnet
    const xrpAddress = await payIDClient.xrpAddressForPayID(
      payID,
      XRPLNetwork.Main,
    )

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'X7zmKiqEhMznSXgj9cirEnD5sWo3iZSbeFRexSFN1xZ8Ktn')
  })

  it('Resolve PayID to XRP - known PayID - testnet', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function(done) {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will not resolve.
    const payID = '$dev.payid.xpring.money/hbergren'
    const network = XRPLNetwork.Dev

    // WHEN it is resolved to an unmapped value.
    payIDClient.xrpAddressForPayID(payID, network).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.MappingNotFound,
      )

      const { message } = error
      assert.include(message, payID)
      assert.include(message, network)

      done()
    })
  })
})
