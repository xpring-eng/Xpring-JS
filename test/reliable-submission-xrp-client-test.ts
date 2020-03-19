import { assert } from 'chai'
import { Wallet } from 'xpring-common-js'
import bigInt from 'big-integer'
import { AccountAddress } from 'xpring-common-js/build/generated/org/xrpl/rpc/v1/account_pb'
import {
  Account,
  Sequence,
  SigningPublicKey,
  TransactionSignature,
  Amount,
  Destination,
} from 'xpring-common-js/build/generated/org/xrpl/rpc/v1/common_pb'
import {
  XRPDropsAmount,
  Currency,
  CurrencyAmount,
  IssuedCurrencyAmount,
} from 'xpring-common-js/build/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Transaction,
  Payment,
} from '../src/generated/web/org/xrpl/rpc/v1/transaction_pb'
import FakeXRPClient from './fakes/fake-xrp-client'
import ReliableSubmissionXRPClient from '../src/reliable-submission-xrp-client'
import RawTransactionStatus from '../src/raw-transaction-status'
import TransactionStatus from '../src/transaction-status'
import XRPTransaction from '../src/XRP/xrp-transaction'

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
// set up XRPTransaction object from Transaction protocol buffer
// TODO(amiecorso): set up reusable mock protobuf objects for tests, because they are a huge pain to repeatedly construct
const account = 'r123'
const fee = '1'
const sequence = 2
const signingPublicKey = new Uint8Array([1, 2, 3])
const transactionSignature = new Uint8Array([4, 5, 6])

const testCurrencyProto: Currency = new Currency()
testCurrencyProto.setCode(new Uint8Array([1, 2, 3]))
testCurrencyProto.setName('currencyName')

const testAccountAddress = new AccountAddress()
testAccountAddress.setAddress('r123')

const testIssuedCurrency = new IssuedCurrencyAmount()
testIssuedCurrency.setCurrency(testCurrencyProto)
testIssuedCurrency.setIssuer(testAccountAddress)
testIssuedCurrency.setValue('100')

const transactionAccountAddressProto = new AccountAddress()
transactionAccountAddressProto.setAddress(account)
const transactionAccountProto = new Account()
transactionAccountProto.setValue(transactionAccountAddressProto)

const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(fee)

const transactionSequenceProto = new Sequence()
transactionSequenceProto.setValue(sequence)

const transactionSigningPublicKeyProto = new SigningPublicKey()
transactionSigningPublicKeyProto.setValue(signingPublicKey)

const transactionTransactionSignatureProto = new TransactionSignature()
transactionTransactionSignatureProto.setValue(transactionSignature)

const paymentCurrencyAmountProto = new CurrencyAmount()
paymentCurrencyAmountProto.setIssuedCurrencyAmount(testIssuedCurrency)
const paymentAmountProto = new Amount()
paymentAmountProto.setValue(paymentCurrencyAmountProto)
const destinationAccountAddressProto = new AccountAddress()
destinationAccountAddressProto.setAddress('r123')
const paymentDestinationProto = new Destination()
paymentDestinationProto.setValue(destinationAccountAddressProto)
const transactionPaymentProto = new Payment()
transactionPaymentProto.setAmount(paymentAmountProto)
transactionPaymentProto.setDestination(paymentDestinationProto)

const transactionProto = new Transaction()
transactionProto.setAccount(transactionAccountProto)
transactionProto.setFee(transactionFeeProto)
transactionProto.setSequence(transactionSequenceProto)
transactionProto.setSigningPublicKey(transactionSigningPublicKeyProto)
transactionProto.setTransactionSignature(transactionTransactionSignatureProto)
transactionProto.setPayment(transactionPaymentProto)

const fakedTransactionHistoryValue = [XRPTransaction.from(transactionProto)]

describe('Reliable Submission XRP Client', function(): void {
  beforeEach(function() {
    this.fakeXRPClient = new FakeXRPClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedLastLedgerSequenceValue,
      fakedRawTransactionStatusValue,
      fakedAccountExistsValue,
      fakedTransactionHistoryValue,
    )
    this.reliableSubmissionClient = new ReliableSubmissionXRPClient(
      this.fakeXRPClient,
    )
  })

  it('Get Account Balance - Response Not Modified', async function() {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a balance is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getBalance(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedGetBalanceValue)
  })

  it('Get Payment Status - Response Not Modified', async function() {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getPaymentStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionStatusValue)
  })

  it('Get Latest Ledger Sequence - Response Not Modified', async function() {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN the latest ledger sequence is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getLastValidatedLedgerSequence()

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedLastLedgerSequenceValue)
  })

  it('Get Raw Transaction Status - Response Not Modified', async function() {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN a raw transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getRawTransactionStatus(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedRawTransactionStatusValue)
  })

  it('Send - Returns when the latestLedgerSequence is too low', async function() {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000)

    // GIVEN A ledger sequence number that will increment in 200ms.
    setTimeout(() => {
      const latestLedgerSequence =
        fakedRawTransactionStatusLastLedgerSequenceValue + 1
      this.fakeXRPClient.latestLedgerSequence = latestLedgerSequence
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

  it('Send - Returns when the transaction is validated', async function() {
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

  it("Send - Throws when transaction doesn't have a last ledger sequence", function(done) {
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

  it('Get Payment History - Response Not Modified', async function() {
    // GIVEN a `ReliableSubmissionXRPClient` decorating a `FakeXRPClient` WHEN transaction history is retrieved.
    const returnedValue = await this.reliableSubmissionClient.paymentHistory(
      testAddress,
    )

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionHistoryValue)
  })
})
