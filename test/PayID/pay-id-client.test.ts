import { assert } from 'chai'
import nock from 'nock'
import { PayIdUtils } from 'xpring-common-js'
import PayIdClient from '../../src/PayID/pay-id-client'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import XrplNetwork from 'xpring-common-js'

describe('PayIdClient', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('cryptoAddressForPayId - invalid Pay ID', function (done): void {
    // GIVEN a PayIDClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not contain '$'
    const payIDClient = new PayIdClient()

    // WHEN an XRPAddress is requested for an invalid pay ID THEN an invalid Pay ID error is thrown.
    payIDClient
      .cryptoAddressForPayId(invalidPayID, XrplNetwork.Test)
      .catch((error) => {
        assert.equal(
          (error as PayIdError).errorType,
          PayIdErrorType.InvalidPayId,
        )
        done()
      })
  })

  it('cryptoAddressForPayId - successful response - match found', async function () {
    // GIVEN a PayIdClient, valid PayID and mocked networking to return a match for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

    const payIDComponents = PayIdUtils.parsePayID(payId)
    if (!payIDComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
    }
    const address = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'
    const replyHeaders = {
      'content-type': 'application/xrpl-testnet+json',
    }

    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(
        200,
        {
          addresses: [
            {
              addressDetailsType: 'CryptoAddressDetails',
              addressDetails: {
                address,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an XRP address is requested.
    const xrpAddressDetails = await payIdClient.cryptoAddressForPayId(
      payId,
      'xrpl-testnet',
    )

    // THEN the address exists.
    assert.equal(xrpAddressDetails.address, address)
    assert.equal(xrpAddressDetails.tag, undefined)
  })

  it('cryptoAddressForPayId - successful response - match not found', function (done) {
    // GIVEN a PayIdClient, valid PayID and mocked networking to return a 404 for the payID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()
    const network = XrplNetwork.Test

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money').get('/georgewashington').reply(404, {})

    // WHEN an XRPAddress is requested.
    payIdClient.cryptoAddressForPayId(payId, 'xrpl-testnet').catch((error) => {
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

  it('cryptoAddressForPayId - unknown mime type', function (done) {
    // GIVEN a PayIdClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

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
    payIdClient.cryptoAddressForPayId(payId, 'xrpl-testnet').catch((error) => {
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

  it('cryptoAddressForPayId - failed request', function (done) {
    // GIVEN a PayIdClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

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
    payIdClient.cryptoAddressForPayId(payId, `xrpl-network`).catch((error) => {
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

  it('cryptoAddressForPayId - successful response - unexpected response format', function (done) {
    // GIVEN a PayID client, valid PayID and mocked networking to return a match for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    // Field isn't named `address` in response.
    nock('https://xpring.money').get('/georgewashington').reply(200, {
      incorrectFieldName: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
    })

    // WHEN an XRPAddress is requested for a Pay ID.
    payIdClient.cryptoAddressForPayId(payId, 'xrpl-testnet').catch((error) => {
      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )
      done()
    })
  })

  it('cryptoAddressForPayId - successful response - mismatched headers', function (done) {
    // GIVEN mocked networking to return a match for the PayID on the wrong network.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

    const payIDComponents = PayIdUtils.parsePayID(payId)
    if (!payIDComponents) {
      throw new Error('Test precondition failed: Could not generate a PayID')
    }
    const address = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'
    const replyHeaders = {
      'content-type': 'application/btc-testnet+json',
    }

    nock('https://xpring.money')
      .get('/georgewashington')
      .reply(
        200,
        {
          addresses: [
            {
              addressDetailsType: 'CryptoAddressDetails',
              addressDetails: {
                address,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an address is requested for the PayID.
    payIdClient.cryptoAddressForPayId(payId, 'xrpl-testnet').catch((error) => {
      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )
      done()
    })
  })

  it('allAddressesForPayId - invalid Pay ID', function (done): void {
    // GIVEN an PayIdClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not contain '$'
    const payIdClient = new PayIdClient()

    // WHEN all addresses are resolved THEN an invalid Pay ID error is thrown.
    payIdClient.allAddressesForPayId(invalidPayID).catch((error) => {
      assert.equal((error as PayIdError).errorType, PayIdErrorType.InvalidPayId)
      done()
    })
  })

  it('allAddressesForPayId - successful response - match found', async function () {
    // GIVEN a PayIdClient, a valid PayID and mocked networking to return a set of matches for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
    }

    const replyHeaders = {
      'content-type': 'application/payid+json',
    }

    const addresses = [
      {
        addressDetailsType: 'CryptoAddressDetails',
        addressDetails: {
          address: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
        },
      },
      {
        addressDetailsType: 'CryptoAddressDetails',
        addressDetails: {
          address: 'XV5sbjUmgPpvXv4ixFWZ5ptAYZ6PD28Sq49uo34VyjnmK5H',
        },
      },
    ]

    nock('https://xpring.money').get('/georgewashington').reply(
      200,
      {
        addresses: addresses,
      },
      replyHeaders,
    )

    // WHEN all addresses are resolved.
    const resolvedAddresses = await payIdClient.allAddressesForPayId(payId)

    // THEN the returned data is as expected.
    assert.deepEqual(addresses, resolvedAddresses)
  })

  it('allAddressesForPayId - successful response - match not found', function (done) {
    // GIVEN a PayIdClient, a valid PayID and mocked networking to return a 404 for the payID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new PayIdClient()

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money').get('/georgewashington').reply(404, {})

    // WHEN all addresses are resolved
    payIdClient.allAddressesForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.MappingNotFound,
      )

      const { message } = error
      assert.include(message, payId)

      done()
    })
  })
})
