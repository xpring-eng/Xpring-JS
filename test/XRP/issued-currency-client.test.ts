import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import { FakeXRPNetworkClient } from './fakes/fake-xrp-network-client'
import { FakeJsonNetworkClient } from './fakes/fake-json-network-client'
import 'mocha'
import TrustLine from '../../src/XRP/shared/trustline'
import { assert } from 'chai'

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
    for (const trustLineJson of (
      await fakeSucceedingJsonClient.getAccountLines(testAddress)
    ).result.lines) {
      const trustLine = new TrustLine(trustLineJson)
      expectedTrustLines.push(trustLine)
    }

    // THEN the result is as expected
    assert.deepEqual(trustLines, expectedTrustLines)
  })

  it('getTrustLines - error response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
  })
})
