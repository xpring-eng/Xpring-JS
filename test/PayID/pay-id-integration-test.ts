import { assert } from 'chai'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'
import PayIDClient from '../../src/PayID/pay-id-client'
import XRPLNetwork from '../../src/Common/xrpl-network'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

describe('PayID Integration Tests', function(): void {
  it('Resolve PayID to XRP - known PayID - mainnet', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Mainnet.
    const payIDClient = new PayIDClient(XRPLNetwork.Main)
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN it is resolved to an XRP address
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'X7zmKiqEhMznSXgj9cirEnD5sWo3iZSbeFRexSFN1xZ8Ktn')
  })

  it('Resolve PayID to XRP - known PayID - testnet', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Testnet.
    const payIDClient = new PayIDClient(XRPLNetwork.Test)
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function(done) {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will not resolve on Devnet.
    const payID = '$dev.payid.xpring.money/hbergren'
    const network = XRPLNetwork.Dev
    const payIDClient = new PayIDClient(network)

    // WHEN it is resolved to an unmapped value.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
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
