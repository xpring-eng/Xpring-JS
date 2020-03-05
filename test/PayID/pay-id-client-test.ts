import { assert } from 'chai'
import PayIDClient from '../../src/PayID/pay-id-client'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'

const payID = '$xpring.money/keefertaylor'

describe('Pay ID Client', function(): void {
  it('xrpAddressForPayID - throws unimplemented', function(done): void {
    // GIVEN a PayIDClient.
    const payIDClient = new PayIDClient()

    // WHEN an XRPAddress is requested THEN an unimplemented error is thrown.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
      assert.typeOf(error, PayIDError.name)
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.Unimplemented,
      )
      done()
    })
  })
})
