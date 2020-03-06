import { assert } from 'chai'
import nock from 'nock'
import { PayIDUtils } from 'xpring-common-js'
import PayIDClient from '../../src/PayID/pay-id-client'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'

describe('Pay ID Client', function(): void {
  afterEach(function() {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayID - invalid Pay ID', function(done): void {
    // GIVEN a PayIDClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const payIDClient = new PayIDClient()

    // WHEN an XRPAddress is requested for an invalid pay ID THEN an invalid payment pointer error is thrown.
    payIDClient.xrpAddressForPayID(invalidPayID).catch((error) => {
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.InvalidPaymentPointer,
      )
      done()
    })
  })

  it('xrpAddressForPayID - successful response - match found', async function() {
    // GIVEN a PayID client, valid PayID and mocked networking to return a match for the PayID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient()

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(200, {
        address: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address exists.
    // TODO(keefertaylor): Tighten up this condition when proper response parsing is implemented.
    assert.exists(xrpAddress)
  })

  it('xrpAddressForPayID - successful response - match not found', async function() {
    // GIVEN a PayID client, valid PayID and mocked networking to return a 404 for the payID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient()

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(404, {})

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is undefined.
    assert.isUndefined(xrpAddress)
  })

  it('xrpAddressForPayID - failed request', function(done) {
    // GIVEN a PayIDClient and with mocked networking to return a server error.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient()

    const serverErrorCode = 500
    const serverErrorMessage = 'internal error'
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(serverErrorCode, serverErrorMessage)

    // WHEN an XRPAddress is requested for a Pay ID.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.UnexpectedResponse,
      )

      const { message } = error
      assert.include(message, `${serverErrorCode}`)
      assert.include(message, serverErrorMessage)

      done()
    })
  })

  it('xrpAddressForPayID - successful response - unexpected response format', function(done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a match for the PayID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient()

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    // Field isn't named `address` in response.
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(200, {
        incorrectFieldName: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
      })

    // WHEN an XRPAddress is requested for a Pay ID.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
      console.log(`I caught ${(error as PayIDError).errorType}`)
      console.log(`exepcted ${PayIDErrorType.UnexpectedResponse}`)

      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.UnexpectedResponse,
      )
      done()
    })
  })
})
