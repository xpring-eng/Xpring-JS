import { assert } from 'chai'
import nock from 'nock'
import { PayIDUtils, Utils } from 'xpring-common-js'
import XRPLNetwork from '../../src/Common/xrpl-network'
import XRPPayIDClient from '../../src/PayID/xrp-pay-id-client'

describe('XRP Pay ID Client', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('xrpAddressForPayID - successful response - x address', async function () {
    // GIVEN a PayID client, valid PayID and mocked networking to return an X-Address for the PayID.
    const payID = 'georgewashington$xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)

    const xAddress = 'X7cBcY4bdTTzk3LHmrKAK6GyrirkXfLHGFxzke5zTmYMfw4'

    const payIDComponents = PayIDUtils.parsePayID(payID)
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
              address: xAddress,
            },
          },
        ],
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the X-Address is the returned.
    assert.equal(xrpAddress, xAddress)
  })

  it('xrpAddressForPayID - successful response - classic address with no tag', async function () {
    // GIVEN a PayID client, valid PayID and mocked networking to return a classic address for the PayID.
    const payID = 'georgewashington$xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)

    const classicAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
    const xAddress = Utils.encodeXAddress(classicAddress, undefined, true)

    const payIDComponents = PayIDUtils.parsePayID(payID)
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
              address: classicAddress,
            },
          },
        ],
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the given input in X-Address format.
    assert.equal(xrpAddress, xAddress)
  })

  it('xrpAddressForPayID - successful response - classic address with tag', async function () {
    // GIVEN a PayID client, valid PayID and mocked networking to return a classic address and tag for the PayID.
    const payID = 'georgewashington$xpring.money'
    const payIDClient = new XRPPayIDClient(XRPLNetwork.Test)

    const classicAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
    const tag = 12345
    const xAddress = Utils.encodeXAddress(classicAddress, tag, true)

    const payIDComponents = PayIDUtils.parsePayID(payID)
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
              address: classicAddress,
              tag,
            },
          },
        ],
      })

    // WHEN an XRP address is requested.
    const xrpAddress = await payIDClient.xrpAddressForPayID(payID)

    // THEN the address is the given input in X-Address format.
    assert.equal(xrpAddress, xAddress)
  })
})
