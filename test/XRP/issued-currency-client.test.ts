import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import { FakeXRPNetworkClient } from './fakes/fake-xrp-network-client'
import {
  FakeJsonNetworkClient,
  FakeJsonNetworkClientResponses,
} from './fakes/fake-json-network-client'
import 'mocha'
import TrustLine from '../../src/XRP/shared/trustline'
import { assert } from 'chai'
import { XrpError } from '../../src/XRP'
import { AccountLinesResponseJson } from '../../src/XRP/shared/json-schema'

const fakeSucceedingGrpcClient = new FakeXRPNetworkClient()
// const fakeErroringNetworkClient = new FakeXRPNetworkClient(
//   FakeXRPNetworkClientResponses.defaultErrorResponses,
// )
const fakeSucceedingJsonClient = new FakeJsonNetworkClient()

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

describe('Issued Currency Client', function (): void {
  it('getTrustLines - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called
    const trustLines = await issuedCurrencyClient.getTrustLines(testAddress)
    const expectedTrustLines: Array<TrustLine> = []
    const trustlinesJson: AccountLinesResponseJson = await fakeSucceedingJsonClient.getAccountLines(
      testAddress,
    )
    if (trustlinesJson.result.lines === undefined) {
      throw XrpError.malformedResponse
    }
    for (const trustLineJson of trustlinesJson.result.lines) {
      const trustLine = new TrustLine(trustLineJson)
      expectedTrustLines.push(trustLine)
    }

    // THEN the result is as expected
    assert.deepEqual(trustLines, expectedTrustLines)
  })

  it('getTrustLines - invalid account', function (done): void {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called with an invalid address THEN an error is propagated.
    const address = 'malformedAddress'
    issuedCurrencyClient.getTrustLines(address).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
      done()
    })
  })

  it('getTrustLines - account not found error response', function (done): void {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const accountNotFoundResponse: AccountLinesResponseJson = {
      result: {
        error: 'actNotFound',
        status: 'error',
      },
    }
    const fakeErroringJsonClientResponses = new FakeJsonNetworkClientResponses(
      accountNotFoundResponse,
    )
    const fakeErroringJsonClient = new FakeJsonNetworkClient(
      fakeErroringJsonClientResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeErroringJsonClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called THEN an error is propagated.
    issuedCurrencyClient.getTrustLines(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.accountNotFound)
      done()
    })
  })
})
