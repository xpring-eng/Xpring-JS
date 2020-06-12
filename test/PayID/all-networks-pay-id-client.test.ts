import { assert } from 'chai'
import nock from 'nock'
import { PayIdUtils } from 'xpring-common-js'
import PayIdError, { PayIdErrorType } from '../../src/PayID/pay-id-error'
import AllNetworksPayIdClient from '../../src/PayID/all-networks-pay-id-client'

describe('AllNetworkPayIdClient', function (): void {
  afterEach(function () {
    // Clean nock after each test.
    nock.cleanAll()
  })

  it('allAddressesForPayId - invalid Pay ID', function (done): void {
    // GIVEN an AllNetworksPayIdClient and an invalid PayID.
    const invalidPayID = 'xpring.money/georgewashington' // Does not start with '$'
    const payIdClient = new AllNetworksPayIdClient()

    // WHEN addresses are resolved THEN an invalid Pay ID error is thrown.
    payIdClient.allAddressesForPayId(invalidPayID).catch((error) => {
      assert.equal((error as PayIdError).errorType, PayIdErrorType.InvalidPayId)
      done()
    })
  })

  it('allAddressesForPayId - successful response - match found', async function () {
    // GIVEN a AllNetworksPayIdClient, valid PayID and mocked networking to return a set of matches for the PayID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new AllNetworksPayIdClient()

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not generate a Pay ID')
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

    nock('https://xpring.money').get('/georgewashington').reply(200, {
      addresses: addresses,
    })

    // WHEN all addresses are resolved.
    const resolvedAddresses = await payIdClient.allAddressesForPayId(payId)

    // THEN the returned data is as expected.
    assert.deepEqual(addresses, resolvedAddresses)
  })

  it('xrpAddressForPayId - successful response - match not found', function (done) {
    // GIVEN a AllNetworksPayIdClient, valid PayID and mocked networking to return a 404 for the payID.
    const payId = 'georgewashington$xpring.money'
    const payIdClient = new AllNetworksPayIdClient()

    const payIdComponents = PayIdUtils.parsePayID(payId)
    if (!payIdComponents) {
      throw new Error('Test precondition failed: Could not parse Pay ID')
    }
    nock('https://xpring.money').get('/georgewashington').reply(404, {})

    // WHEN addresses are resolved
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
