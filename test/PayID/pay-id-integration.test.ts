import { assert } from 'chai'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import PayIdClient from '../../src/PayID/pay-id-client'
import XrpPayIdClient from '../../src/PayID/xrp-pay-id-client'
import XrplNetwork from '../../src/Common/xrpl-network'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

describe('PayID Integration Tests', function (): void {
  it('Resolve PayID to XRP - known PayID - mainnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Mainnet.
    const payIdClient = new XrpPayIdClient(XrplNetwork.Main, false)
    const payId = 'alice$payid.ci'

    // WHEN it is resolved to an XRP address
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'X7zmKiqEhMznSXgj9cirEnD5sWo3iZSbeFRexSFN1xZ8Ktn')
  })

  it('Resolve PayID to XRP - known PayID - testnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Testnet.
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test, false)
    const payId = 'alice$xpring.ci'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function (done) {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will not resolve on Devnet.
    const payId = 'does-not-exist$xpring.ci'
    const network = XrplNetwork.Dev
    const payIdClient = new XrpPayIdClient(network, false)

    // WHEN it is resolved to an unmapped value.
    payIdClient.xrpAddressForPayId(payId).catch((error) => {
      console.log(`error:  ${error.message}, ${JSON.stringify(error)}`)

      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.MappingNotFound,
      )

      const { message } = error
      assert.include(message, payId)
      assert.include(message, network)

      done()
    })
  })

  it('Resolve PayID to BTC - known PayID - testnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on BTC testnet.
    const payIdClient = new PayIdClient(false)
    const payId = 'alice$xpring.ci'
    const network = 'btc-testnet'

    // WHEN it is resolved to an XRP address
    const btcAddress = await payIdClient.cryptoAddressForPayId(payId, network)

    // THEN the address is the expected value.
    assert.deepEqual(btcAddress, {
      address: '2NF9H32iwQcVcoAiiBmAtjpGmQfsmU5L6SR',
    })
  })

  it('resolves all addresses', async function (): Promise<void> {
    // GIVEN a PayID with multiple addresses.
    const payId = 'alice$xpring.ci'
    const payIdClient = new PayIdClient(false)

    // WHEN the PayID is resolved to a set of addresses.
    const addresses = await payIdClient.allAddressesForPayId(payId)

    // THEN multiple results are returned.
    assert(addresses.length > 1)
  })
})
