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
import { GetAccountInfoResponse } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/get_account_info_pb'
import {
  Meta,
  TransactionResult,
} from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/meta_pb'
import { Transaction } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/transaction_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
} from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/amount_pb'
import {
  Balance,
  LastLedgerSequence,
} from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/common_pb'
import { AccountRoot } from '../../src/XRP/Generated/node/org/xrpl/rpc/v1/ledger_objects_pb'

// The network layer is faked, so this is a perfunctory argument
const transactionHash = 'DEADBEEF'
const { wallet } = Wallet.generateRandomWallet()!

const fakeSucceedingNetworkClient = new FakeXRPNetworkClient()

/**
 * Convenience function which allows construction of `GetAccountInfoResponse` objects.
 *
 * @param latestLedgerSequence: The latest validated ledger sequence that will appear in this AccountInfoResponse
 */
function makeAccountInfoResponse(
  latestLedgerSequence: number,
): GetAccountInfoResponse {
  const xrpAmount = new XRPDropsAmount()
  xrpAmount.setDrops('10')

  const currencyAmount = new CurrencyAmount()
  currencyAmount.setXrpAmount(xrpAmount)

  const balance = new Balance()
  balance.setValue(currencyAmount)

  const accountRoot = new AccountRoot()
  accountRoot.setBalance(balance)

  const accountInfo = new GetAccountInfoResponse()
  accountInfo.setAccountData(accountRoot)
  accountInfo.setLedgerIndex(latestLedgerSequence)

  return accountInfo
}

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

  it('awaitFinalTransactionResult - Returns when the lastLedgerSequence has been passed', async function (): Promise<
    void
  > {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(10000)

    // GIVEN a CommonXrplClient with fake networking that will succeed, while providing a not-yet-validated transaction status
    const transactionResult = new TransactionResult()
    transactionResult.setResult('tefFAILURE')

    const meta = new Meta()
    meta.setTransactionResult(transactionResult)

    // Transaction with valid lastLedgerSequence
    const lastLedgerSequenceValue = 10
    const lastLedgerSequence = new LastLedgerSequence()
    lastLedgerSequence.setValue(lastLedgerSequenceValue)

    const transaction = new Transaction()
    transaction.setLastLedgerSequence(lastLedgerSequence)

    const getTransactionResponse = new GetTransactionResponse()
    getTransactionResponse.setValidated(false)
    getTransactionResponse.setMeta(meta)
    getTransactionResponse.setTransaction(transaction)

    const notYetValidatedTransactionResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      getTransactionResponse,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      notYetValidatedTransactionResponses,
    )

    const commonXrplClient = new CommonXrplClient(
      fakeNetworkClient,
      XrplNetwork.Test,
    )

    // AND a ledger sequence number that will increment in 200 ms, while transaction remains unvalidated
    const newLatestLedgerSequenceValue = lastLedgerSequenceValue + 1
    const newAccountInfoResponse = makeAccountInfoResponse(
      newLatestLedgerSequenceValue,
    )

    const newFakeNetworkClientResponses = new FakeXRPNetworkClientResponses(
      newAccountInfoResponse,
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      getTransactionResponse,
    )
    const newNetworkClient = new FakeXRPNetworkClient(
      newFakeNetworkClientResponses,
    )
    setTimeout(() => {
      commonXrplClient.networkClient = newNetworkClient
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN awaitFinalTransactionResult is called
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
    assert.equal(rawTransactionStatus.isValidated, false)
    assert.equal(rawTransactionStatus.transactionStatusCode, 'tefFAILURE')
  })
})
