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
    const payIdClient = new XrpPayIdClient(XrplNetwork.Main)
    const payId = 'alice$dev.payid.xpring.money'

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
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function (done) {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will not resolve on Devnet.
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

  it('Resolve PayID to BTC - known PayID - testnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Mainnet.
    const payIdClient = new PayIdClient('btc-testnet')
    const payId = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address
    const btcAddress = await payIdClient.addressForPayId(payId)

    // THEN the address is the expected value.
    assert.deepEqual(btcAddress, {
      address: '2NF9H32iwQcVcoAiiBmAtjpGmQfsmU5L6SR',
    })
  })

  it('getInvoice', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID.
    const payId = 'dino$travel.payid.xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    // WHEN the Pay ID receipt endpoint is hit
    const invoice = await payIdClient.getInvoice(payId, 'abc123')

    // THEN the server returns a result.
    assert.exists(invoice)
  })

  it('postInvoice', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID.
    const payId = 'dino$travel.payid.xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    // WHEN the Pay ID receipt endpoint is hit
    const invoice = await payIdClient.postInvoice(
      payId,
      '123456',
      'x509 + sha256',
      [],
      '00:c9:22:69:31:8a:d6:6c:ea:da:c3:7f:2c:ac:a5:af:c0:02:ea:81:cb:65:b9:fd:0c:6d:46:5b:c9:1e:9d:3b:ef',
      '8b:c3:ed:d1:9d:39:6f:af:40:72:bd:1e:18:5e:30:54:23:35',
      'Theodore Kalaw',
      'ef841530-f476-429c-b8f3-de25a0a29f80',
      '520 Main Street',
      'xpring',
      '100',
      1,
      '2020-03-20T07:09:00',
      'xpring',
    )

    // THEN the server returns a result.
    assert.exists(invoice)
  })

  it('receipt', async function (): Promise<void> {
    // GIVEN a Pay ID.
    const payId = 'dino$travel.payid.xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Main)

    // WHEN the Pay ID receipt endpoint is hit then an error is not thrown.
    await payIdClient.receipt(
      payId,
      'some_invoice_hash',
      'some_transaction_hash',
    )
  })
})
