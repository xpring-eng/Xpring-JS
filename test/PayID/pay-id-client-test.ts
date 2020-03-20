import { assert } from 'chai'
import nock from 'nock'
import { PayIDUtils } from 'xpring-common-js'
import PayIDClient from '../../src/PayID/pay-id-client'
import PayIDError, { PayIDErrorType } from '../../src/PayID/pay-id-error'
import XRPLNetwork from '../../src/Common/xrpl-network'

// Parameters for reciept.
const invoiceHash = 'some_invoice_hash'
const transasctionConfirmation = 'some_transaction_confirmation'

describe('Pay ID Client', function(): void {
  afterEach(function() {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayID - invalid Pay ID', function(done): void {
    // GIVEN a PayIDClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

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
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(200, {
        addressDetailsType: 'CryptoAddressDetails',
        addressDetails: {
          address: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
        },
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address exists.
    // TODO(keefertaylor): Tighten up this condition when proper response parsing is implemented.
    assert.exists(xrpAddress)
  })

  it('xrpAddressForPayID - successful response - match not found', function(done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a 404 for the payID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)
    const network = XRPLNetwork.Test

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(404, {})

    // WHEN an XRPAddress is requested.
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

  it('xrpAddressForPayID - unknown mime type', function(done) {
    // GIVEN a PayIDClient and with mocked networking to return a server error.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

    const serverErrorCode = 415
    const serverError = {
      statusCode: serverErrorCode,
      error: 'Unsupported Media Type',
      message: 'Unknown MIME type requested.',
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(serverErrorCode, serverError)

    // WHEN an XRPAddress is requested for a Pay ID.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.UnexpectedResponse,
      )

      const { message } = error
      assert.include(message, `${serverErrorCode}`)
      assert.include(message, serverError.message)

      done()
    })
  })

  it('xrpAddressForPayID - failed request', function(done) {
    // GIVEN a PayIDClient and with mocked networking to return a server error.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

    const serverErrorCode = 503
    const serverError = {
      statusCode: serverErrorCode,
      error: 'Internal error',
      message: 'Something went wrong and it is not your fault',
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(serverErrorCode, serverError)

    // WHEN an XRPAddress is requested for a Pay ID.
    payIDClient.xrpAddressForPayID(payID).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.UnexpectedResponse,
      )

      const { message } = error
      assert.include(message, `${serverErrorCode}`)
      assert.include(message, serverError.message)

      done()
    })
  })

  it('xrpAddressForPayID - successful response - unexpected response format', function(done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a match for the PayID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

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
      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIDError).errorType,
        PayIDErrorType.UnexpectedResponse,
      )
      done()
    })
  })

  it('recipt - successful response', async function() {
    // GIVEN a PayID client, valid PayID and mocked networking to return a receipt for the Pay ID.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }
    nock('https://xpring.money')
      .post('/georgewashington/receipt')
      .reply(200, 'OK')

    // WHEN the receipt endpoint is hit then an error is not thrown.
    await payIDClient.receipt(payID, invoiceHash, transasctionConfirmation)
  })

  it('recipt - failure', function(done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a failure when a receipt is requested.
    const payID = '$xpring.money/georgewashington'
    const payIDClient = new PayIDClient(XRPLNetwork.Test)

    const paymentPointer = PayIDUtils.parsePaymentPointer(payID)
    if (!paymentPointer) {
      throw new Error(
        'Test precondition failed: Could not generate payment pointer',
      )
    }

    nock('https://xpring.money')
      .post('/georgewashington/receipt')
      .reply(503, {})

    // WHEN the receipt endpoint is hit then an error is not thrown.
    payIDClient
      .receipt(payID, invoiceHash, transasctionConfirmation)
      .catch((error) => {
        // THEN an unexpected response is thrown with the details of the error.
        assert.equal(
          (error as PayIDError).errorType,
          PayIDErrorType.UnexpectedResponse,
        )

        done()
      })
  })

  // TODO(keefertaylor): Write tests for specific error codes returned by the receipt API.
})
