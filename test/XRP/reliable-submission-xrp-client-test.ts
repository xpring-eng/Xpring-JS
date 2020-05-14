import { assert } from 'chai'
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import FakeXRPClient from './fakes/fake-xrp-client'
import ReliableSubmissionXRPClient from '../../src/XRP/reliable-submission-xrp-client'
import RawTransactionStatus from '../../src/XRP/raw-transaction-status'
import TransactionStatus from '../../src/XRP/transaction-status'
import { testXRPTransaction } from './fakes/fake-xrp-protobufs'

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
const fakedTransactionHistoryValue = [testXRPTransaction]
const fakeIsLedgerValidatedValue = false

describe('Reliable Submission XRP Client', function (): void {
  beforeEach(function () {
    this.fakeXRPClient = new FakeXRPClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedLastLedgerSequenceValue,
      fakedRawTransactionStatusValue,
      fakedAccountExistsValue,
      fakedTransactionHistoryValue,
      fakeIsLedgerValidatedValue,
    )
    this.reliableSubmissionClient = new ReliableSubmissionXRPClient(
      this.fakeXRPClient,
    )
  })

  it('Get Account Balance - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a balance is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getBalance(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedGetBalanceValue)
  })

  it('Get Payment Status - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getPaymentStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionStatusValue)
  })

  it('Get Latest Ledger Sequence - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN the latest ledger sequence is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getLastValidatedLedgerSequence()

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedLastLedgerSequenceValue)
  })

  it('Get Raw Transaction Status - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a raw transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getRawTransactionStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedRawTransactionStatusValue)
  })

  it('Send - Returns when the latestLedgerSequence is too low', async function () {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN an XRP client which will report the last ledger sequence is validated in 200ms.
    setTimeout(() => {
      this.fakeXRPClient.isLedgerSequenceValidatedValue = true
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

    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` which will return a transaction that did not have a last ledger sequence attached.
    const malformedRawTransactionStatus = new RawTransactionStatus(
      fakedRawTransactionStatusValidatedValue,
      fakedRawTransactionStatusTransactionStatusCode,
      0,
      fakedFullPaymentValue,
    )
    this.fakeXRPClient.getRawTransactionStatusValue = malformedRawTransactionStatus
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN `send` is called THEN the promise is rejected.
    this.reliableSubmissionClient
      .send('1', testAddress, wallet)
      .then(() => {})
      .catch(() => done())
  })

  it('Payment History - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN transaction history is retrieved.
    const returnedValue = await this.reliableSubmissionClient.paymentHistory(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionHistoryValue)
  })

  it('is - Response Not Modified', async function () {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a ledger is tested for validation.
    const ledgerSequence = 1 // Arbitrarily chosen.
    const returnedValue = await this.reliableSubmissionClient.isLedgerSequenceValidated(
      ledgerSequence,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakeIsLedgerValidatedValue)
  })
})
