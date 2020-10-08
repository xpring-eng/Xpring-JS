import { assert } from 'chai'

import { Utils, WalletFactory, XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import 'mocha'

const fakeSucceedingNetworkClient = new FakeXRPNetworkClient()
// const fakeErroringNetworkClient = new FakeXRPNetworkClient(
//   FakeXRPNetworkClientResponses.defaultErrorResponses,
// )
const walletFactory = new WalletFactory(XrplNetwork.Test)

describe('Default XRP Client', function (): void {
  })
  it('requireAuthorizedTrustlines - successful response', async function (): Promise<
    void
  > {
    const xrpClient = new IssuedCurrencyClient(
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN requireAuthorizedTrustlines is called
    const result = await xrpClient.requireAuthorizedTrustlines(wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('requireAuthorizedTrustlines - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const xrpClient = new IssuedCurrencyClient(
      failingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN requireAuthorizedTrustlines is attempted THEN an error is propagated.
    xrpClient.requireAuthorizedTrustlines(wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })
})
