/* eslint-disable no-restricted-syntax */
import { assert } from 'chai'

import { Wallet, XrplNetwork } from 'xpring-common-js'
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
  TransactionResult as TransactionResultProto,
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
import TransactionResult from '../../src/XRP/model/final-transaction-result'
import TransactionStatus from '../../src/XRP/transaction-status'

// The network layer is faked, so this is a perfunctory argument
const transactionHash = 'DEADBEEF'
const { wallet } = Wallet.generateRandomWallet()!

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
    // GIVEN a CommonXrplClient with fake networking that will succeed with a not-yet-validated transaction response
    const getTransactionResponse = FakeXRPNetworkClientResponses.defaultGetTransactionResponse()
    getTransactionResponse.setValidated(false)

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

    // AND a transaction that will become validated in 200ms
    const newGetTransactionResponse = FakeXRPNetworkClientResponses.defaultGetTransactionResponse()
    newGetTransactionResponse.setValidated(true)

    const newFakeNetworkClientResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      newGetTransactionResponse,
    )
    const newNetworkClient = new FakeXRPNetworkClient(
      newFakeNetworkClientResponses,
    )
    setTimeout(() => {
      commonXrplClient.networkClient = newNetworkClient
    }, 200)

    // WHEN awaitFinalTransactionResult is called.
    const finalTransactionResult = await commonXrplClient.awaitFinalTransactionResult(
      transactionHash,
      wallet,
    )
    // THEN it returns and the result is as expected.
    const expectedTransactionResult = new TransactionResult(
      transactionHash,
      TransactionStatus.Succeeded,
      true,
    )

    assert.deepEqual(finalTransactionResult, expectedTransactionResult)
  })

  it("awaitFinalTransactionResult - Throws when transaction doesn't have a last ledger sequence", function (done) {
    const transactionResult = new TransactionResultProto()
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
    const transactionResult = new TransactionResultProto()
    transactionResult.setResult('tefSUCCESS')

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

    // WHEN awaitFinalTransactionResult is called
    const finalTransactionResult = await commonXrplClient.awaitFinalTransactionResult(
      transactionHash,
      wallet,
    )

    // TODO: (amiecorso) in separate PR, update the generation of a `TransactionResult` such that:
    // - consider renaming to FinalTransactionResult
    // - take into account whether the lastLedgerSequence has been passed on the transaction in question, thus giving it a `Failed` state
    // - or better, some new state such as TransactionStatus.LastLedgerPassed

    // THEN it returns and the result is as expected.
    const expectedResult = new TransactionResult(
      transactionHash,
      TransactionStatus.LastLedgerPassed,
      false,
    )

    assert.deepEqual(finalTransactionResult, expectedResult)
  })
})
