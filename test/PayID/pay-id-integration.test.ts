import { assert } from 'chai'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import PayIdClient from '../../src/PayID/pay-id-client'
import XrpPayIdClient from '../../src/PayID/xrp-pay-id-client'
import { XrplNetwork } from 'xpring-common-js'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

describe('PayID Integration Tests', function (): void {
  it('Resolve PayID to XRP - known PayID - mainnet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a PayID that will resolve on Mainnet.
    const payIdClient = new XrpPayIdClient(XrplNetwork.Main)
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'X7zmKiqEhMznSXgj9cirEnD5sWo3iZSbeFRexSFN1xZ8Ktn')
  })

  it('Resolve PayID to XRP - known PayID - testnet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a PayID that will resolve on Testnet.
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function (done) {
    this.timeout(timeoutMs)

    // GIVEN a PayID that will not resolve on Devnet.
    const payId = 'does-not-exist$dev.payid.xpring.money'
    const network = XrplNetwork.Dev
    const payIdClient = new XrpPayIdClient(network)

    // WHEN it is resolved to an unmapped value.
    payIdClient.xrpAddressForPayId(payId).catch((error) => {
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

  it('Resolve PayID to BTC - known PayID - testnet', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a PayID that will resolve on BTC testnet.
    const payIdClient = new PayIdClient()
    const payId = 'alice$dev.payid.xpring.money'
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
    const payId = 'alice$dev.payid.xpring.money'
    const payIdClient = new PayIdClient()

    // WHEN the PayID is resolved to a set of addresses.
    const addresses = await payIdClient.allAddressesForPayId(payId)

    // THEN multiple results are returned.
    assert(addresses.length > 1)
  })
})
