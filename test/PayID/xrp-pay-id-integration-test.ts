import { assert } from 'chai'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'
import PayIDClient from '../../src/PayID/pay-id-client'
import XRPPayIDClient from '../../src/PayID/xrp-pay-id-client'
import XRPLNetwork from '../../src/Common/xrpl-network'
import ComplianceType from '../../src/PayID/compliance-type'

// A timeout for these tests.
const timeoutMs = 60 * 1000 // 1 minute

describe('PayID Integration Tests', function (): void {
  it('Resolve PayID to XRP - known PayID - mainnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Mainnet.
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Main)
    const payID = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'X7zmKiqEhMznSXgj9cirEnD5sWo3iZSbeFRexSFN1xZ8Ktn')
  })

  it('Resolve PayID to XRP - known PayID - testnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Testnet.
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)
    const payID = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address on testnet
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(xrpAddress, 'TVacixsWrqyWCr98eTYP7FSzE9NwupESR4TrnijN7fccNiS')
  })

  it('Resolve PayID to XRP - unknown PayID - devnet', function (done) {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will not resolve on Devnet.
    const payID = 'does-not-exist$dev.payid.xpring.money'
    const network = XRPLNetwork.Dev
    const payIDClient = new XRPPayIDClient(network)

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

  it('Resolve PayID to BTC - known PayID - testnet', async function (): Promise<
    void
  > {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID that will resolve on Mainnet.
    const payIDClient = new PayIDClient('btc-testnet')
    const payID = 'alice$dev.payid.xpring.money'

    // WHEN it is resolved to an XRP address
    const btcAddress = await payIDClient.addressForPayID(payID)

    // THEN the address is the expected value.
    assert.equal(btcAddress, '2NF9H32iwQcVcoAiiBmAtjpGmQfsmU5L6SR')
  })

  it('getInvoice', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID.
    const payID = 'dino$travel.payid.xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)

    // WHEN the Pay ID receipt endpoint is hit
    const invoice = await payIDClient.getInvoice(payID, 'abc123')

    // THEN the server returns a result.
    assert.exists(invoice)
  })

  it('postInvoice', async function (): Promise<void> {
    this.timeout(timeoutMs)

    // GIVEN a Pay ID.
    const payID = 'dino$travel.payid.xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)

    // WHEN the Pay ID receipt endpoint is hit
    const invoice = await payIDClient.postInvoice(
      payID,
      '123456',
      'x509 + sha256',
      [],
      '00:c9:22:69:31:8a:d6:6c:ea:da:c3:7f:2c:ac:a5:af:c0:02:ea:81:cb:65:b9:fd:0c:6d:46:5b:c9:1e:9d:3b:ef',
      '8b:c3:ed:d1:9d:39:6f:af:40:72:bd:1e:18:5e:30:54:23:35',
      ComplianceType.TravelRule,
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
    const payID = 'dino$travel.payid.xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Main)

    // WHEN the Pay ID receipt endpoint is hit then an error is not thrown.
    await payIDClient.receipt(
      payID,
      'some_invoice_hash',
      'some_transaction_hash',
    )
  })
})
