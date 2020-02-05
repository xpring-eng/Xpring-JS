/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import { TransactionStatus as RawTransactionStatus } from '../src/generated/node/legacy/transaction_status_pb'
import FakeXpringClient from './fakes/fake-xpring-client'
import ReliableSubmissionXpringClient from '../src/reliable-submission-xpring-client'
import TransactionStatus from '../src/transaction-status'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'

const fakedGetBalanceValue = bigInt(10)
const fakedTransactionStatusValue = TransactionStatus.Succeeded
const fakedSendValue = 'DEADBEEF'
const fakedLastLedgerSequenceValue = 10

const fakedRawTransactionStatusValue = new RawTransactionStatus()
const fakedRawTransactionStatusLastLedgerSequenceValue = 20
const fakedRawTransactionStatusValidatedValue = true
const fakedRawTransactionStatusTransactionStatusCode = transactionStatusCodeSuccess

describe('Reliable Submission Xpring Client', (): void => {
  let originalTimeout: number
  let fakeXpringClient: FakeXpringClient
  let reliableSubmissionClient: ReliableSubmissionXpringClient
  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

    fakedRawTransactionStatusValue.setLastLedgerSequence(
      fakedRawTransactionStatusLastLedgerSequenceValue,
    )
    fakedRawTransactionStatusValue.setValidated(
      fakedRawTransactionStatusValidatedValue,
    )
    fakedRawTransactionStatusValue.setTransactionStatusCode(
      fakedRawTransactionStatusTransactionStatusCode,
    )

    fakeXpringClient = new FakeXpringClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedLastLedgerSequenceValue,
      fakedRawTransactionStatusValue,
    )
    reliableSubmissionClient = new ReliableSubmissionXpringClient(
      fakeXpringClient,
    )
  })

  it('Get Account Balance - Response Not Modified', async () => {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a balance is retrieved.
    const returnedValue = await reliableSubmissionClient.getBalance(testAddress)

    // THEN the result is returned unaltered.
    expect(returnedValue).toEqual(fakedGetBalanceValue)
  })

  it('Get Transaction Status - Response Not Modified', async () => {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a transaction status is retrieved.
    const returnedValue = await reliableSubmissionClient.getTransactionStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    expect(returnedValue).toEqual(fakedTransactionStatusValue)
  })

  it('Get Latest Ledger Sequence - Response Not Modified', async () => {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN the latest ledger sequence is retrieved.
    const returnedValue = await reliableSubmissionClient.getLastValidatedLedgerSequence()

    // THEN the result is returned unaltered.
    expect(returnedValue).toEqual(fakedLastLedgerSequenceValue)
  })

  it('Get Raw Transaction Status - Response Not Modified', async () => {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a raw transaction status is retrieved.
    const returnedValue = await reliableSubmissionClient.getRawTransactionStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    expect(returnedValue).toEqual(fakedRawTransactionStatusValue)
  })

  it('Send - Returns when the latestLedgerSequence is too low', async () => {
    // GIVEN A ledger sequence number that will increment in 200ms.
    setTimeout(() => {
      const latestLedgerSequence =
        fakedRawTransactionStatusLastLedgerSequenceValue + 1
      fakeXpringClient.getLastValidatedLedgerSequenceValue = latestLedgerSequence
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN a reliable send is submitted
    const transactionHash = await reliableSubmissionClient.send(
      '1',
      testAddress,
      wallet,
    )

    // THEN the function returns
    expect(transactionHash).toEqual(fakedSendValue)
  })

  it('Send - Returns when the transaction is validated', async () => {
    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout(() => {
      fakedRawTransactionStatusValue.setValidated(true)
    }, 200)
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN a reliable send is submitted
    const transactionHash = await reliableSubmissionClient.send(
      '1',
      testAddress,
      wallet,
    )

    // THEN the function returns
    expect(transactionHash).toEqual(fakedSendValue)
  })

  it("Send - Throws when transaction doesn't have a last ledger sequence", (done) => {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` which will return a transaction that did not have a last ledger sequence attached.
    const malformedRawTransactionStatus = new RawTransactionStatus()
    malformedRawTransactionStatus.setLastLedgerSequence(0)
    fakeXpringClient.getRawTransactionStatusValue = malformedRawTransactionStatus
    const { wallet } = Wallet.generateRandomWallet()!

    // WHEN `send` is called THEN the promise is rejected.
    reliableSubmissionClient
      .send('1', testAddress, wallet)
      .then(() => {})
      .catch(() => done())
  })

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })
})
