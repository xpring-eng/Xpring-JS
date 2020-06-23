import { assert } from 'chai'
import nock from 'nock'
import { PayIdUtils } from 'xpring-common-js'
import PayIdClient from '../../src/PayID/pay-id-client'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import XrplNetwork from '../../src/Common/xrpl-network'

describe('PayIdClient', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayId - invalid Pay ID', function (done): void {
    // GIVEN a PayIDClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const payIDClient = new PayIdClient(XrplNetwork.Test)

    // WHEN an XRPAddress is requested for an invalid pay ID THEN an invalid Pay ID error is thrown.
    payIDClient.addressForPayId(invalidPayID).catch((error) => {
      assert.equal((error as PayIdError).errorType, PayIdErrorType.InvalidPayId)
      done()
    })
  })

  it('xrpAddressForPayId - successful response - match found', async function () {
    // GIVEN a PayIdClient, valid PayID and mocked networking to return a match for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient(XrplNetwork.Test)

    const payIDComponents = PayIdUtils.parsePayID(payId)
    if (!payIDComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
    }
    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(200, {
        addresses: [
          {
            addressDetailsType: 'CryptoAddressDetails',
            addressDetails: {
              address: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
            },
          },
        ],
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIdClient.addressForPayId(payId)

    // THEN the address exists.
    // TODO(keefertaylor): Tighten up this condition when proper response parsing is implemented.
    assert.exists(xrpAddress)
  })

  it('xrpAddressForPayId - successful response - match not found', function (done) {
    // GIVEN a PayIDClient, valid PayID and mocked networking to return a 404 for the payID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient(XrplNetwork.Test)
    const network = XrplNetwork.Test

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money').get('/georgewashington').reply(404, {})

    // WHEN an XRPAddress is requested.
    payIdClient.addressForPayId(payId).catch((error) => {
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

  it('xrpAddressForPayId - unknown mime type', function (done) {
    // GIVEN a PayIDClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient(XrplNetwork.Test)

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
    payIdClient.addressForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )

      const { message } = error
      assert.include(message, `${serverErrorCode}`)
      assert.include(message, serverError.message)

      done()
    })
  })

  it('xrpAddressForPayId - failed request', function (done) {
    // GIVEN a PayIdClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient(XrplNetwork.Test)

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
    payIdClient.addressForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )

      const { message } = error
      assert.include(message, `${serverErrorCode}`)
      assert.include(message, serverError.message)

      done()
    })
  })

  it('xrpAddressForPayId - successful response - unexpected response format', function (done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a match for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient(XrplNetwork.Test)

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    // Field isn't named `address` in response.
    nock('https://xpring.money').get('/georgewashington').reply(200, {
      incorrectFieldName: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
    })

    // WHEN an XRPAddress is requested for a Pay ID.
    payIdClient.addressForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )
      done()
    })
  })
})
