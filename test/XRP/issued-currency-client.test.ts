import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import { FakeXRPNetworkClient } from './fakes/fake-xrp-network-client'
import { FakeJsonNetworkClient } from './fakes/fake-json-network-client'
import 'mocha'

const fakeSucceedingGrpcClient = new FakeXRPNetworkClient()
// const fakeErroringNetworkClient = new FakeXRPNetworkClient(
//   FakeXRPNetworkClientResponses.defaultErrorResponses,
// )
const fakeSucceedingJsonClient = new FakeJsonNetworkClient()

describe('Issued Currency Client', function (): void {
  it('Dummy description', function (): void {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN the compiler is told to shut up THEN everything is fine.
    issuedCurrencyClient.shutUpCompiler()
  })
})
