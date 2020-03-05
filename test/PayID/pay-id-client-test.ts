import { assert } from 'chai'
import nock from 'nock'
import PayIDClient from '../../src/PayID/pay-id-client'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'

describe('Pay ID Client', function(): void {
  it('xrpAddressForPayID - invalid pay id', function(done): void {
    // GIVEN a PayIDClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const payIDClient = new PayIDClient()

    // WHEN an XRPAddress is requested for an invalid pay ID THEN an unimplemented error is thrown.
    payIDClient.xrpAddressForPayID(invalidPayID).catch((error) => {
      assert.typeOf(error, PayIDError.name)
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.InvalidPaymentPointer,
      )
      done()
    })
  })

  it('xrpAddressForPayID - successful response', async function() {
    // GIVEN a PayID client, valid PayID and mocked networking to return a successful response.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient()

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    nock(paymentPointer.host)
      .get(paymentPointer.paths)
      .reply(200, {})

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address exists.
    assert.exists(xrpAddress)
  })

  // TODO(keefertaylor): Test the case where an address mapping is not found, when error handling is implemented.
})
