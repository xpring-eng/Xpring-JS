import { assert } from 'chai'
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import FakeXrpClient from './fakes/fake-xrp-client'
import ReliableSubmissionXrpClient from '../../src/XRP/reliable-submission-xrp-client'
import RawTransactionStatus from '../../src/XRP/raw-transaction-status'
import TransactionStatus from '../../src/XRP/transaction-status'
import { testXrpTransaction } from './fakes/fake-xrp-protobufs'
import XrplNetwork from '../../src/Common/xrpl-network'
import Result from '../Common/Helpers/result'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'

const transactionHash = 'DEADBEEF'

const fakedGetBalanceValue = bigInt(10)
const fakedTransactionStatusValue = TransactionStatus.Succeeded
const fakedSendValue = transactionHash
const fakedLastLedgerSequenceValue = 10

const fakedRawTransactionStatusLastLedgerSequenceValue = 20
const fakedRawTransactionStatusValidatedValue = true
const fakedRawTransactionStatusTransactionStatusCode = transactionStatusCodeSuccess
const fakedAccountExistsValue = true
const fakedFullPaymentValue = true
const fakedRawTransactionStatusValue = new RawTransactionStatus(
  fakedRawTransactionStatusValidatedValue,
  fakedRawTransactionStatusTransactionStatusCode,
  fakedRawTransactionStatusLastLedgerSequenceValue,
  fakedFullPaymentValue,
)
const fakedTransactionHistoryValue = [testXrpTransaction]
const fakedGetPaymentValue = testXrpTransaction
const fakedEnableDepositAuthValue: Result<[string, TransactionStatus]> = [
  transactionHash,
  TransactionStatus.Succeeded,
]

describe('Reliable Submission XRP Client', function (): void {
  beforeEach(function () {
    this.fakeXrpClient = new FakeXrpClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedLastLedgerSequenceValue,
      fakedRawTransactionStatusValue,
      fakedAccountExistsValue,
      fakedTransactionHistoryValue,
      fakedGetPaymentValue,
      fakedEnableDepositAuthValue,
    )
    this.reliableSubmissionClient = new ReliableSubmissionXrpClient(
      this.fakeXrpClient,
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

  it('Get Latest Ledger Sequence - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN the latest ledger sequence is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getLatestValidatedLedgerSequence(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedLastLedgerSequenceValue)
  })

  it('Get Raw Transaction Status - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN a raw transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getRawTransactionStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedRawTransactionStatusValue)
  })

  it('Send - Returns when the latestLedgerSequence is too low', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A ledger sequence number that will increment in 200ms.
    setTimeout(() => {
      const latestLedgerSequence =
        fakedRawTransactionStatusLastLedgerSequenceValue + 1
      this.fakeXrpClient.latestLedgerSequence = latestLedgerSequence
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

  it('Send - Returns when the transaction is validated', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout(() => {
      fakedRawTransactionStatusValue.isValidated = true
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

  it("Send - Throws when transaction doesn't have a last ledger sequence", function (done) {
    // Increase timeout because the poll interview is 4s.
    this.timeout(5000)

    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` which will return a transaction that did not have a last ledger sequence attached.
    const malformedRawTransactionStatus = new RawTransactionStatus(
      fakedRawTransactionStatusValidatedValue,
      fakedRawTransactionStatusTransactionStatusCode,
      0,
      fakedFullPaymentValue,
    )
    this.fakeXrpClient.getRawTransactionStatusValue = malformedRawTransactionStatus
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN `send` is called THEN the promise is rejected.
    this.reliableSubmissionClient
      .send('1', testAddress, wallet)
      .catch(() => done())
  })

  it('Payment History - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` WHEN transaction history is retrieved.
    const returnedValue = await this.reliableSubmissionClient.paymentHistory(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionHistoryValue)
  })

  it('Enable Deposit Auth - Returns when the latestLedgerSequence is too low', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A ledger sequence number that will increment in 200ms.
    setTimeout(() => {
      const latestLedgerSequence =
        fakedRawTransactionStatusLastLedgerSequenceValue + 1
      this.fakeXrpClient.latestLedgerSequence = latestLedgerSequence
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN enableDepositAuth is called
    const {
      transactionHash,
    } = await this.reliableSubmissionClient.enableDepositAuth(wallet)

    // THEN the function returns
    assert.deepEqual(transactionHash, fakedSendValue)
  })

  it('Enable Deposit Auth - Returns when the transaction is validated', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout(() => {
      fakedRawTransactionStatusValue.isValidated = true
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN enableDepositAuth is called
    const {
      transactionHash,
    } = await this.reliableSubmissionClient.enableDepositAuth(wallet)

    // THEN the function returns
    assert.deepEqual(transactionHash, fakedEnableDepositAuthValue[0])
  })

  it("Enable Deposit Auth - Throws when transaction doesn't have a last ledger sequence", function (done) {
    // Increase timeout because the poll interview is 4s.
    this.timeout(5000)

    // GIVEN a `ReliableSubmissionXrpClient` decorating a `FakeXrpClient` which will return a transaction that did not have a last ledger sequence attached.
    const malformedRawTransactionStatus = new RawTransactionStatus(
      fakedRawTransactionStatusValidatedValue,
      fakedRawTransactionStatusTransactionStatusCode,
      0,
      fakedFullPaymentValue,
    )
    this.fakeXrpClient.getRawTransactionStatusValue = malformedRawTransactionStatus
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN `enableDepositAuth` is called THEN the promise is rejected.
    this.reliableSubmissionClient.enableDepositAuth(wallet).catch(() => done())
  })
})
