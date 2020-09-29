/* eslint-disable no-restricted-syntax */
import { assert } from 'chai'

import { Utils, Wallet, XrplNetwork } from 'xpring-common-js'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import 'mocha'
import CommonXrplClient from '../../src/XRP/common-xrpl-client'
import { GetTransactionResponse } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/get_transaction_pb'
import {
  Meta,
  TransactionResult,
} from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/meta_pb'
import { Transaction } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/transaction_pb'

// The network layer is faked, so this is a perfunctory argument
const transactionHash = 'DEADBEEF'
const { wallet } = Wallet.generateRandomWallet()!

const fakeSucceedingNetworkClient = new FakeXRPNetworkClient()

describe('Common XRPL Client', function (): void {
  it('awaitFinalTransactionResult - returns when transaction is validated', async function (): Promise<
    void
  > {
    // GIVEN a CommonXrplClient with fake networking that will succeed.
    const commonXrplClient = new CommonXrplClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN awaitFinalTransactionResult is called.
    const rawTransactionStatus = await commonXrplClient.awaitFinalTransactionResult(
      transactionHash,
      wallet,
    )
    // THEN it returns and the result is as expected.
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.deepEqual(
      rawTransactionStatus,
      await commonXrplClient.getRawTransactionStatus(expectedTransactionHash),
    )
  })

  it("awaitFinalTransactionResult - Throws when transaction doesn't have a last ledger sequence", function (done) {
    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')

    const meta = new Meta()
    meta.setTransactionResult(transactionResult)

    // Transaction missing lastLedgerSequence
    const transaction = new Transaction()

    const getTransactionResponse = new GetTransactionResponse()
    getTransactionResponse.setValidated(true)
    getTransactionResponse.setMeta(meta)
    getTransactionResponse.setTransaction(transaction)

    const transactionWithoutLastLedgerResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      getTransactionResponse,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      transactionWithoutLastLedgerResponses,
    )
    const commonXrplClient = new CommonXrplClient(
      fakeNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN awaitFinalTransactionResult is called THEN the promise is rejected.
    commonXrplClient
      .awaitFinalTransactionResult(transactionHash, wallet)
      .catch(() => done())
  })

  // 'Returns when the latestLedgerSequence is too low'
  // could consider a "returns when validated but with failed status code"
})
