import { assert } from 'chai'
import nock from 'nock'
import { PayIdUtils } from 'xpring-common-js'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import XrplNetwork from '../../src/Common/xrpl-network'
import { SignatureWrapperInvoice } from '../../src/PayID/Generated/api'
import SingleNetworkPayIdClient from '../../src/PayID/single-network-pay-id-client'

// Nonce for getInvoice and postInvoice
const nonce = '123456'

// Parameters for postInvoice
const publicKeyType = 'x509+sha256'
const publicKeyData = []
const publicKey =
  '00:c9:22:69:31:8a:d6:6c:ea:da:c3:7f:2c:ac:a5:af:c0:02:ea:81:cb:65:b9:fd:0c:6d:46:5b:c9:1e:9d:3b:ef'
const signature = '8b:c3:ed:d1:9d:39:6f:af:40:72:bd:1e:18:5e:30:54:23:35'
const originatorUserLegalName = 'Theodore Kalaw'
const originatorAccountID = 'ef841530-f476-429c-b8f3-de25a0a29f80'
const originatorUserPhysicalAddress = '520 Main Street'
const originatorInstitutionName = 'xpring'
const amount = '100'
const scale = 1
const timestamp = '2020-03-20T07:09:00'
const beneficiaryName = 'xpring'

// Parameters for reciept.
const invoiceHash = 'some_invoice_hash'
const transasctionConfirmation = 'some_transaction_confirmation'

describe('SingleNetworkPayIdClient', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayId - invalid Pay ID', function (done): void {
    // GIVEN a SingleNetworkPayIdClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    // WHEN an XRPAddress is requested for an invalid pay ID THEN an invalid Pay ID error is thrown.
    singleNetworkPayIdClient.addressForPayId(invalidPayID).catch((error) => {
      assert.equal((error as PayIdError).errorType, PayIdErrorType.InvalidPayId)
      done()
    })
  })

  it('xrpAddressForPayId - successful response - match found', async function () {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a match for the PayID.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

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
    const xrpAddress = await singleNetworkPayIdClient.addressForPayId(payId)

    // THEN the address exists.
    // TODO(keefertaylor): Tighten up this condition when proper response parsing is implemented.
    assert.exists(xrpAddress)
  })

  it('xrpAddressForPayId - successful response - match not found', function (done) {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a 404 for the payID.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )
    const network = XrplNetwork.Test

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money').get('/georgewashington').reply(404, {})

    // WHEN an XRPAddress is requested.
    singleNetworkPayIdClient.addressForPayId(payId).catch((error) => {
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
    // GIVEN a SingleNetworkPayIdClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

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
    singleNetworkPayIdClient.addressForPayId(payId).catch((error) => {
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
    // GIVEN a SingleNetworkPayIdClient and with mocked networking to return a server error.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

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
    singleNetworkPayIdClient.addressForPayId(payId).catch((error) => {
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
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    // Field isn't named `address` in response.
    nock('https://xpring.money').get('/georgewashington').reply(200, {
      incorrectFieldName: 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4',
    })

    // WHEN an XRPAddress is requested for a Pay ID.
    singleNetworkPayIdClient.addressForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )
      done()
    })
  })

  it('getInvoice - successful response', async function () {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a invoice for the Pay ID.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    const mockResponse = {
      messageType: 'Invoice',
      message: {
        nonce,
        expirationTime: '1584725859',
        paymentInformation: {
          addresses: [
            {
              paymentNetwork: 'xrpl',
              paymentEnvironment: 'main',
              addressDetailsType: 'CryptoAddressDetails',
              addressDetails: {
                address: 'T71Qcu6Txyi5y4aa6ZaVBD3aKC4oCbQTBQr3QfmJBywhnwm',
              },
            },
          ],
          proofOfControlSignature: '9743b52063cd84097a65d1633f5c74f5',
          paymentPointer: '$xpring.money/dino',
        },
        complianceRequirements: ['TravelRule'],
        memo: 'please send me travel rule data',
        complianceHashes: [],
      },
      publicKeyType: 'x509+sha256',
      publicKeyData: [],
      publicKey:
        '00:c9:22:69:31:8a:d6:6c:ea:da:c3:7f:2c:ac:a5:af:c0:02:ea:81:cb:65:b9:fd:0c:6d:46:5b:c9:1e:9d:3b:ef',
      signature: '8b:c3:ed:d1:9d:39:6f:af:40:72:bd:1e:18:5e:30:54:23:35',
    }

    nock('https://xpring.money')
      .get(`/georgewashington/invoice?nonce=${nonce}`)
      .reply(200, mockResponse)

    // WHEN the invoice endpoint is hit.
    const invoice = await singleNetworkPayIdClient.getInvoice(payId, nonce)

    // THEN the invoice was the mocked response.
    assert.deepEqual(invoice, mockResponse)
  })

  it('getInvoice - failure', function (done) {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a failure when a invoice is requested.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    nock('https://xpring.money')
      .get(`/georgewashington/invoice?nonce=${nonce}`)
      .reply(503, {})

    // WHEN the getInvoice endpoint is hit
    singleNetworkPayIdClient.getInvoice(payId, nonce).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )

      done()
    })
  })

  // TODO(keefertaylor): Write tests for specific error codes returned by the getInvoice API.

  it('postInvoice - successful response', async function () {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a invoice for the given Pay ID and compliance data.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    const mockResponse: SignatureWrapperInvoice = {
      messageType: 'Invoice',
      message: {
        nonce: '123456',
        expirationTime: '2020-03-18T04:05:02',
        paymentInformation: {
          addresses: [],
        },
        complianceRequirements: ['TravelRule'],
        memo: 'thanks for travel rule data, here is your new invoice',
        complianceHashes: [
          {
            type: 'TravelRule',
            hash: '8743b52063cd84097a65d1633f5c74f5',
          },
        ],
      },
      publicKeyType: 'x509+sha256',
      publicKeyData: [],
      publicKey:
        '00:c9:22:69:31:8a:d6:6c:ea:da:c3:7f:2c:ac:a5:af:c0:02:ea:81:cb:65:b9:fd:0c:6d:46:5b:c9:1e:9d:3b:ef',
      signature: '8b:c3:ed:d1:9d:39:6f:af:40:72:bd:1e:18:5e:30:54:23:35...',
    }

    nock('https://xpring.money')
      .post(`/georgewashington/invoice`)
      .query({ nonce })
      .reply(200, mockResponse)

    // WHEN the invoice endpoint is hit.
    const invoice = await singleNetworkPayIdClient.postInvoice(
      payId,
      nonce,
      publicKeyType,
      publicKeyData,
      publicKey,
      signature,
      originatorUserLegalName,
      originatorAccountID,
      originatorUserPhysicalAddress,
      originatorInstitutionName,
      amount,
      scale,
      timestamp,
      beneficiaryName,
    )

    // THEN the invoice was the mocked response.
    assert.deepEqual(invoice, mockResponse)
  })

  it('postInvoice - failure', function (done) {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a failure when a invoice is requested.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    nock('https://xpring.money')
      .post(`/georgewashington/invoice`)
      .query({ nonce })
      .reply(503, {})

    // WHEN the postInvoice endpoint
    singleNetworkPayIdClient
      .postInvoice(
        payId,
        nonce,
        publicKeyType,
        publicKeyData,
        publicKey,
        signature,
        originatorUserLegalName,
        originatorAccountID,
        originatorUserPhysicalAddress,
        originatorInstitutionName,
        amount,
        scale,
        timestamp,
        beneficiaryName,
      )
      .catch((error) => {
        // THEN an unexpected response is thrown with the details of the error.
        assert.equal(
          (error as PayIdError).errorType,
          PayIdErrorType.UnexpectedResponse,
        )

        done()
      })
  })

  // TODO(keefertaylor): Write tests for specific error codes returned by the postInvoice API.

  it('receipt - successful response', async function () {
    // GIVEN a PayID client, valid PayID and mocked networking to return a receipt for the Pay ID.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money')
      .post('/georgewashington/receipt')
      .reply(200, 'OK')

    // WHEN the receipt endpoint is hit then an error is not thrown.
    await singleNetworkPayIdClient.receipt(
      payId,
      invoiceHash,
      transasctionConfirmation,
    )
  })

  it('receipt - failure', function (done) {
    // GIVEN a SingleNetworkPayIdClient, valid PayID and mocked networking to return a failure when a receipt is requested.
    const payId = 'georgewashington$xpring.money'
    const singleNetworkPayIdClient = new SingleNetworkPayIdClient(
      XrplNetwork.Test,
    )

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }

    nock('https://xpring.money')
      .post('/georgewashington/receipt')
      .reply(503, {})

    // WHEN the receipt endpoint is hit
    singleNetworkPayIdClient
      .receipt(payId, invoiceHash, transasctionConfirmation)
      .catch((error) => {
        // THEN an unexpected response is thrown with the details of the error.
        assert.equal(
          (error as PayIdError).errorType,
          PayIdErrorType.UnexpectedResponse,
        )

        done()
      })
  })

  // TODO(keefertaylor): Write tests for specific error codes returned by the receipt API.
})
