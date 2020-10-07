import { XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import { FakeXRPNetworkClient } from './fakes/fake-xrp-network-client'
import 'mocha'

const fakeSucceedingNetworkClient = new FakeXRPNetworkClient()
// const fakeErroringNetworkClient = new FakeXRPNetworkClient(
//   FakeXRPNetworkClientResponses.defaultErrorResponses,
// )

describe('Default XRP Client', function (): void {
  it('Dummy description', function (): void {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the compiler is told to shut up THEN everything is fine.
    issuedCurrencyClient.shutUpCompiler()
  })
})
