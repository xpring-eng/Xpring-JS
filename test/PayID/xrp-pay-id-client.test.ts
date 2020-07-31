import { assert } from 'chai'
import nock from 'nock'
import { PayIdUtils } from 'xpring-common-js'
import XrpUtils from '../../src/XRP/xrp-utils'
import XrplNetwork from '../../src/Common/xrpl-network'
import XrpPayIdClient from '../../src/PayID/xrp-pay-id-client'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'

describe('XRP Pay ID Client', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayId - successful response - x address', async function () {
    // GIVEN an XrpPayIdClient, valid PayID and mocked networking to return an X-Address for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    const xAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'
    const replyHeaders = {
      'content-type': 'application/xrpl-testnet+json',
    }
    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
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
                address: xAddress,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an XRP address is requested.
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the X-Address is the returned.
    assert.equal(xrpAddress, xAddress)
  })

  it('xrpAddressForPayId - successful response - classic address with no tag', async function () {
    // GIVEN an XrpPayIdClient, valid PayID and mocked networking to return a classic address for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    const classicAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
    const xAddress = XrpUtils.encodeXAddress(classicAddress, undefined, true)

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
    }

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
                address: classicAddress,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an XRP address is requested.
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the given input in X-Address format.
    assert.equal(xrpAddress, xAddress)
  })

  it('xrpAddressForPayId - successful response - classic address with tag', async function () {
    // GIVEN an XrpPayIdClient, valid PayID and mocked networking to return a classic address and tag for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    const classicAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
    const tag = 12345
    const xAddress = XrpUtils.encodeXAddress(classicAddress, tag, true)
    const replyHeaders = {
      'content-type': 'application/xrpl-testnet+json',
    }

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
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
                address: classicAddress,
                tag,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an XRP address is requested.
    const xrpAddress = await payIdClient.xrpAddressForPayId(payId)

    // THEN the address is the given input in X-Address format.
    assert.equal(xrpAddress, xAddress)
  })

  it('xrpAddressForPayId - successful response - multiple classic addresses returned', function (done) {
    // GIVEN an XrpPayIdClient, valid PayID and mocked networking to return multiple addresses for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new XrpPayIdClient(XrplNetwork.Test)

    const classicAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
    const replyHeaders = {
      'content-type': 'application/xrpl-testnet+json',
    }

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
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
                address: classicAddress,
              },
            },
            {
              addressDetailsType: 'CryptoAddressDetails',
              addressDetails: {
                address: classicAddress,
              },
            },
          ],
        },
        replyHeaders,
      )

    // WHEN an XRP address is requested
    payIdClient.xrpAddressForPayId(payId).catch((error) => {
      // THEN an unexpected response is thrown with the details of the error.
      assert.equal(
        (error as PayIdError).errorType,
        PayIdErrorType.UnexpectedResponse,
      )
      done()
    })
  })
})
