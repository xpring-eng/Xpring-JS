import chai, { assert } from 'chai'
import bigInt from 'big-integer'

import { Utils, Wallet } from 'xpring-common-js'
import chaiString from 'chai-string'
import { TransactionStatus as TransactionStatusResponse } from '../../src/generated/node/legacy/transaction_status_pb'

import LegacyDefaultXRPClient, {
  LegacyXRPClientErrorMessages,
} from '../../src/legacy/legacy-default-xrp-client'
import {
  FakeLegacyNetworkClient,
  FakeLegacyNetworkClientResponses,
} from './fakes/fake-legacy-network-client'
import 'mocha'
import TransactionStatus from '../../src/transaction-status'

const fakeSucceedingNetworkClient = new FakeLegacyNetworkClient()
const fakeErroringNetworkClient = new FakeLegacyNetworkClient(
  FakeLegacyNetworkClientResponses.defaultErrorResponses,
)

chai.use(chaiString)

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'
const transactionStatusFailureCodes = [
  'tefFAILURE',
  'tecCLAIM',
  'telBAD_PUBLIC_KEY',
  'temBAD_FEE',
  'terRETRY',
]

const transactionHash = 'DEADBEEF'

describe('Legacy Default Xpring Client', function(): void {
  it('Get Account Balance - successful response', async function() {
    // GIVEN a LegacyDefaultXRPClient.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)

    // WHEN the balance for an account is requested.
    const balance = await xrpClient.getBalance(testAddress)

    // THEN the balance is returned.
    assert.exists(balance)
  })

  it('Get Account Balance - classic address', function(done) {
    // GIVEN an XRPClient and a classic address
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xrpClient.getBalance(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, LegacyXRPClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Get Account Balance - error', function(done) {
    // GIVEN an XRPClient which wraps an erroring network client.
    const xrpClient = new LegacyDefaultXRPClient(fakeErroringNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xrpClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, FakeLegacyNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', function(done) {
    // GIVEN an XRPClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeLegacyNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeLegacyNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeLegacyNetworkClient(
      fakeNetworkClientResponses,
    )
    const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xrpClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        LegacyXRPClientErrorMessages.malformedResponse,
      )
      done()
    })
  })

  it('Send XRP Transaction - success with BigInteger', async function() {
    // GIVEN an XRPClient, a wallet, and a BigInteger denomonated amount.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN the account makes a transaction.
    const transactionHash = await xrpClient.send(
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
    // GIVEN an XRPClient, a wallet, and a number denominated amount.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 10

    // WHEN the account makes a transaction.
    const transactionHash = await xrpClient.send(
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
    // GIVEN an XRPClient, a wallet, and a numeric string denominated amount.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = '10'

    // WHEN the account makes a transaction.
    const transactionHash = await xrpClient.send(
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
    // GIVEN an XRPClient, a wallet and an amount that is invalid.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 'not_a_number'

    // WHEN the account makes a transaction THEN an error is propagated.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      done()
    })
  })

  it('Send XRP Transaction - get fee failure', function(done) {
    // GIVEN an XRPClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new LegacyDefaultXRPClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - failure with classic address', function(done) {
    // GIVEN an XRPClient, a wallet, and a classic address as the destination.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'
    const amount = bigInt('10')

    // WHEN the account makes a transaction THEN an error is thrown.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, LegacyXRPClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Send XRP Transaction - get account info failure', function(done) {
    // GIVEN an XRPClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultError,
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new LegacyDefaultXRPClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - get latest ledger sequence failure', function(done) {
    // GIVEN an XRPClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultSubmitSignedTransactionResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new LegacyDefaultXRPClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - submission failure', function(done) {
    // GIVEN an XRPClient which will to submit a transaction.
    const feeFailureResponses = new FakeLegacyNetworkClientResponses(
      FakeLegacyNetworkClientResponses.defaultAccountInfoResponse(),
      FakeLegacyNetworkClientResponses.defaultFeeResponse(),
      FakeLegacyNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeLegacyNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new LegacyDefaultXRPClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Get Transaction Status - Unvalidated Transaction and Failure Code', async function() {
    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN an XRPClient which will return an unvalidated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
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
      const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xrpClient.getTransactionStatus(
        transactionHash,
      )

      // THEN the status is pending.
      assert.deepEqual(transactionStatus, TransactionStatus.Pending)
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Transaction Status - Unvalidated Transaction and Success Code', async function() {
    // GIVEN an XRPClient which will return an unvalidated transaction with a success code.
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
    const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xrpClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending)
  })

  it('Get Transaction Status - Validated Transaction and Failure Code', async function() {
    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN an XRPClient which will return an unvalidated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
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
      const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xrpClient.getTransactionStatus(
        transactionHash,
      )

      // THEN the status is failed.
      assert.deepEqual(transactionStatus, TransactionStatus.Failed)
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Transaction Status - Validated Transaction and Success Code', async function() {
    // GIVEN an XRPClient which will return an validated transaction with a success code.
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
    const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xrpClient.getTransactionStatus(
      transactionHash,
    )

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Node Error', function(done) {
    // GIVEN an XRPClient which will error when a transaction status is requested.
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
    const xrpClient = new LegacyDefaultXRPClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xrpClient.getTransactionStatus(transactionHash).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeLegacyNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Check if account exists - exists with valid address and positive balance', async function() {
    // GIVEN a DefaultXRPClient.
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)

    // WHEN the account does exist
    const exists = await xrpClient.accountExists(testAddress)

    // THEN accountExists returns true
    assert.equal(exists, true)
  })

  it('Check if account exists - failed network request', async function() {
    // GIVEN an XRPClient which wraps an erroring network client.
    const xrpClient = new LegacyDefaultXRPClient(fakeErroringNetworkClient)

    // WHEN accountExists throws an exception while calling getBalance
    const exists = await xrpClient.accountExists(testAddress)

    // THEN accountExists returns false
    assert.equal(exists, false)
  })

  it('Check if account exists - error with classic address', function(done) {
    // GIVEN an XRPClient and a classic address
    const xrpClient = new LegacyDefaultXRPClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN accountExists is called using a classic address THEN an error to use X-Addresses is thrown.
    xrpClient.accountExists(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, LegacyXRPClientErrorMessages.xAddressRequired)
      done()
    })
  })
})
