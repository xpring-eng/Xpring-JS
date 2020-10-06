import { assert } from 'chai'
import { Wallet, XrplNetwork } from 'xpring-common-js'
import bigInt from 'big-integer'
import FakeXrpClient from './fakes/fake-xrp-client'
import ReliableSubmissionXrpClient from '../../src/XRP/reliable-submission-xrp-client'
import RawTransactionStatus from '../../src/XRP/shared/raw-transaction-status'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import { testXrpTransaction } from './fakes/fake-xrp-protobufs'
import TransactionResult from '../../src/XRP/shared/transaction-result'
import FakeCoreXrplClient from './fakes/fake-core-xrpl-client'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'

const transactionHash = 'DEADBEEF'

const fakedGetBalanceValue = bigInt(10)
const fakedTransactionStatusValue = TransactionStatus.Succeeded
const fakedSendValue = transactionHash
const fakedRawTransactionStatusLastLedgerSequenceValue = 20
const fakedRawTransactionStatusValidatedValue = true
const fakedRawTransactionStatusTransactionStatusCode = transactionStatusCodeSuccess
const fakedAccountExistsValue = true
const fakedFullPaymentValue = true
const fakedTransactionHistoryValue = [testXrpTransaction]
const fakedGetPaymentValue = testXrpTransaction
const fakedTransactionResultValue = TransactionResult.getFinalTransactionResult(
  transactionHash,
  TransactionStatus.Succeeded,
  true,
)

describe('Reliable Submission XRP Client', function (): void {
  beforeEach(function () {
    this.fakeXrpClient = new FakeXrpClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedAccountExistsValue,
      fakedTransactionHistoryValue,
      fakedGetPaymentValue,
      fakedTransactionResultValue,
    )

    this.fakedRawTransactionStatusValue = new RawTransactionStatus(
      fakedRawTransactionStatusValidatedValue,
      fakedRawTransactionStatusTransactionStatusCode,
      fakedRawTransactionStatusLastLedgerSequenceValue,
      fakedFullPaymentValue,
    )
    const fakedWaitForFinalTransactionOutcomeValue = {
      rawTransactionStatus: this.fakedRawTransactionStatusValue,
      lastLedgerPassed: false,
    }
    this.fakeCoreXrplClient = new FakeCoreXrplClient(
      fakedWaitForFinalTransactionOutcomeValue,
      fakedTransactionResultValue,
    )
    this.reliableSubmissionClient = new ReliableSubmissionXrpClient(
      this.fakeXrpClient,
      this.fakeCoreXrplClient,
      XrplNetwork.Test,
    )
  })

  it('Get Account Balance - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN a balance is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getBalance(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedGetBalanceValue)
  })

  it('Get Payment Status - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN a transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getPaymentStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionStatusValue)
  })

  it('Send - Returns when the transaction is validated', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout(() => {
      this.fakedRawTransactionStatusValue.isValidated = true
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN a reliable send is submitted
    const transactionHash = await this.reliableSubmissionClient.send(
      '1',
      testAddress,
      wallet,
    )

    // THEN the function returns
    assert.deepEqual(transactionHash, fakedSendValue)
  })

  it('Payment History - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN transaction history is retrieved.
    const returnedValue = await this.reliableSubmissionClient.paymentHistory(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionHistoryValue)
  })

  it('Enable Deposit Auth - Returns when the transaction is validated', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout(() => {
      this.fakedRawTransactionStatusValue.isValidated = true
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN enableDepositAuth is called
    const result = await this.reliableSubmissionClient.enableDepositAuth(wallet)

    // THEN the function returns
    assert.deepEqual(result.hash, fakedTransactionResultValue.hash)
  })
})
