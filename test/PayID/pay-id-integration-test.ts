import { assert } from 'chai'
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

  it('Resolve PayID to XRP - unknown PayID - devnet', async function(): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve.
    const payID = '$dev.payid.xpring.money/hbergren'

    // WHEN it is resolved to an unmapped value.
    const xrpAddress = await payIDClient.xrpAddressForPayID(
      payID,
      XRPLNetwork.Dev,
    )

    // THEN the address undefined.
    assert.isUndefined(xrpAddress)
  })
})
