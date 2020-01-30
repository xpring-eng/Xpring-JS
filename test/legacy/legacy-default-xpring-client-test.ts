import chai, { assert } from 'chai'
import bigInt from 'big-integer'

import { Utils, Wallet } from 'xpring-common-js'
import chaiString from 'chai-string'
import { TransactionStatus as TransactionStatusResponse } from '../../src/legacy/grpc/generated/node/transaction_status_pb'

import LegacyDefaultXpringClient from '../../src/legacy'
import {
  FakeLegacyNetworkClient,
  FakeLegacyNetworkClientResponses,
} from './fakes/fake-legacy-network-client'
import 'mocha'
import TransactionStatus from '../../src/utils/transaction-status'
import XpringClientErrorMessages from '../../src/utils/xpring-client-error-messages'

const fakeSucceedingNetworkClient = new FakeLegacyNetworkClient()
const fakeErroringNetworkClient = new FakeLegacyNetworkClient(
  FakeLegacyNetworkClientResponses.defaultErrorResponses,
)

chai.use(chaiString)

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'
const transactionStatusCodeFailure = 'tecFAILURE'

const transactionHash = 'DEADBEEF'

describe('Legacy Default Xpring Client', function(): void {
  it('Get Account Balance - successful response', async function() {
    // GIVEN a LegacyDefaultXpringClient.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress)

    // THEN the balance is returned.
    assert.exists(balance)
  })

  it('Get Account Balance - classic address', function(done) {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xpringClient.getBalance(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Get Account Balance - error', function(done) {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeErroringNetworkClient,
    )

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, FakeLegacyNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', function(done) {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeLegacyNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeLegacyNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      fakeNetworkClientResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse)
      done()
    })
  })

  it('Send XRP Transaction - success with BigInteger', async function() {
    // GIVEN a XpringClient, a wallet, and a BigInteger denomonated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with number', async function() {
    // GIVEN a XpringClient, a wallet, and a number denominated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 10

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with string', async function() {
    // GIVEN a XpringClient, a wallet, and a numeric string denominated amount.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = '10'

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionBlob = FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse().getTransactionBlob()
    const expectedTransactionHash = Utils.transactionBlobToTransactionHash(
      expectedTransactionBlob,
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - failure with invalid string', function(done) {
    // GIVEN a XpringClient, a wallet and an amount that is invalid.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 'not_a_number'

    // WHEN the account makes a transaction THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      done()
    })
  })

  it('Send XRP Transaction - get fee failure', function(done) {
    // GIVEN a XpringClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - failure with classic address', function(done) {
    // GIVEN a XpringClient, a wallet, and a classic address as the destination.
    const xpringClient = new LegacyDefaultXpringClient(
      fakeSucceedingNetworkClient,
    )
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'
    const amount = bigInt('10')

    // WHEN the account makes a transaction THEN an error is thrown.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Send XRP Transaction - get account info failure', function(done) {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - get latest ledger sequence failure', function(done) {
    // GIVEN a XpringClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - submission failure', function(done) {
    // GIVEN a XpringClient which will to submit a transaction.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Get Transaction Status - Unvalidated Transaction and Failure Code', async function() {
    // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(false)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending)
  })

  it('Get Transaction Status - Unvalidated Transaction and Success Code', async function() {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(false)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending)
  })

  it('Get Transaction Status - Validated Transaction and Failure Code', async function() {
    // GIVEN a XpringClient which will return an validated transaction with a failure code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(true)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeFailure,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is failed.
    assert.deepEqual(transactionStatus, TransactionStatus.Failed)
  })

  it('Get Transaction Status - Validated Transaction and Success Code', async function() {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = new TransactionStatusResponse()
    transactionStatusResponse.setValidated(true)
    transactionStatusResponse.setTransactionStatusCode(
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Node Error', function(done) {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultLedgerSequenceResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      transactionStatusResponses,
    )
    const xpringClient = new LegacyDefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xpringClient.getTransactionStatus(transactionHash).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })
})
