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
  it('Dummy description', function (): void {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the compiler is told to shut up THEN everything is fine.
    issuedCurrencyClient.shutUpCompiler()
  })
  it('Enable Deposit Auth - successful response', async function (): Promise<
    void
  > {
    // GIVEN a IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const xrpClient = new IssuedCurrencyClient(
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

  it('Enable Deposit Auth - submission failure', async function (): Promise<
    void
  > {
    // GIVEN a IssuedCurrencyClient which will fail to submit a transaction.
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
