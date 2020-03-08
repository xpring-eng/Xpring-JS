import { assert } from 'chai'

import bigInt from 'big-integer'
import { Utils, Wallet } from 'xpring-common-js'
import DefaultXpringClient, {
  XpringClientErrorMessages,
} from '../src/default-xpring-client'
import {
  FakeNetworkClient,
  FakeNetworkClientResponses,
} from './fakes/fake-network-client'
import 'mocha'
import { GetTransactionResponse } from '../src/generated/node/org/xrpl/rpc/v1/get_transaction_pb'
import {
  Meta,
  TransactionResult,
} from '../src/generated/node/org/xrpl/rpc/v1/meta_pb'
import TransactionStatus from '../src/transaction-status'
import { Transaction } from '../src/generated/web/org/xrpl/rpc/v1/transaction_pb'

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

const fakeSucceedingNetworkClient = new FakeNetworkClient()
const fakeErroringNetworkClient = new FakeNetworkClient(
  FakeNetworkClientResponses.defaultErrorResponses,
)

/**
 * Convenience function which allows construction of `getTransactionResponse` objects.
 *
 * @param validated Whether the txResponse is validated.
 * @param resultCode The result code.
 */
function makeGetTransactionResponse(
  validated: boolean,
  resultCode: string,
): GetTransactionResponse {
  const transactionResult = new TransactionResult()
  transactionResult.setResult(resultCode)

  const meta = new Meta()
  meta.setTransactionResult(transactionResult)

  const transaction = new Transaction()

  const getTransactionResponse = new GetTransactionResponse()
  getTransactionResponse.setMeta(meta)
  getTransactionResponse.setValidated(validated)
  getTransactionResponse.setTransaction(transaction)

  return getTransactionResponse
}

describe('Default Xpring Client', function(): void {
  it('Get Account Balance - successful response', async function(): Promise<
    void
  > {
    // GIVEN a DefaultXpringClient.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)

    // WHEN the balance for an account is requested.
    const balance = await xpringClient.getBalance(testAddress)

    // THEN the balance is returned.
    assert.exists(balance)
  })

  it('Get Account Balance - classic address', function(done): void {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xpringClient.getBalance(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired)
      done()
    })
  })

  it('Get Account Balance - error', function(done): void {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, FakeNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', function(done): void {
    // GIVEN a XpringClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.getAccountData()!.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(fakeNetworkClientResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN a balance is requested THEN an error is propagated.
    xpringClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.malformedResponse)
      done()
    })
  })

  it('Get Payment Status - Unvalidated Transaction and Failure Code', async function(): Promise<
    void
  > {
    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
      const transactionStatusResponse = makeGetTransactionResponse(
        false,
        transactionStatusCodeFailure,
      )
      const transactionStatusResponses = new FakeNetworkClientResponses(
        FakeNetworkClientResponses.defaultAccountInfoResponse(),
        FakeNetworkClientResponses.defaultFeeResponse(),
        FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
        transactionStatusResponse,
      )
      const fakeNetworkClient = new FakeNetworkClient(
        transactionStatusResponses,
      )
      const xpringClient = new DefaultXpringClient(fakeNetworkClient)

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xpringClient.getPaymentStatus(
        transactionHash,
      )

      // THEN the status is pending.
      assert.deepEqual(transactionStatus, TransactionStatus.Pending)
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Payment Status - Unvalidated Transaction and Success Code', async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = makeGetTransactionResponse(
      false,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getPaymentStatus(
      transactionHash,
    )

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending)
  })

  it('Get Payment Status - Validated Transaction and Failure Code', async function(): Promise<
    void
  > {
    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN a XpringClient which will return an unvalidated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
      // GIVEN a XpringClient which will return an validated transaction with a failure code.
      const transactionStatusResponse = makeGetTransactionResponse(
        true,
        transactionStatusCodeFailure,
      )
      const transactionStatusResponses = new FakeNetworkClientResponses(
        FakeNetworkClientResponses.defaultAccountInfoResponse(),
        FakeNetworkClientResponses.defaultFeeResponse(),
        FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
        transactionStatusResponse,
      )
      const fakeNetworkClient = new FakeNetworkClient(
        transactionStatusResponses,
      )
      const xpringClient = new DefaultXpringClient(fakeNetworkClient)

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xpringClient.getPaymentStatus(
        transactionHash,
      )

      // THEN the status is failed.
      assert.deepEqual(transactionStatus, TransactionStatus.Failed)
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Payment Status - Validated Transaction and Success Code', async function(): Promise<
    void
  > {
    // GIVEN a XpringClient which will return an validated transaction with a success code.
    const transactionStatusResponse = makeGetTransactionResponse(
      true,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xpringClient.getPaymentStatus(
      transactionHash,
    )

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Payment Status - Node Error', function(done): void {
    // GIVEN a XpringClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeNetworkClientResponses.defaultError,
    )
    const fakeNetworkClient = new FakeNetworkClient(transactionStatusResponses)
    const xpringClient = new DefaultXpringClient(fakeNetworkClient)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xpringClient.getPaymentStatus(transactionHash).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - success with BigInteger', async function() {
    // GIVEN a XpringClient, a wallet, and a BigInteger denomonated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with number', async function() {
    // GIVEN a XpringClient, a wallet, and a number denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 10

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with string', async function() {
    // GIVEN a XpringClient, a wallet, and a numeric string denominated amount.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = '10'

    // WHEN the account makes a transaction.
    const transactionHash = await xpringClient.send(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Send XRP Transaction - failure with invalid string', function(done) {
    // GIVEN a XpringClient, a wallet and an amount that is invalid.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
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
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - failure with classic address', function(done) {
    // GIVEN a XpringClient, a wallet, and a classic address as the destination.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
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
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultError,
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Send XRP Transaction - submission failure', function(done) {
    // GIVEN a XpringClient which will to submit a transaction.
    const feeFailureResponses = new FakeNetworkClientResponses(
      FakeNetworkClientResponses.defaultAccountInfoResponse(),
      FakeNetworkClientResponses.defaultFeeResponse(),
      FakeNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeNetworkClient(feeFailureResponses)
    const xpringClient = new DefaultXpringClient(feeFailingNetworkClient)
    const { wallet } = Wallet.generateRandomWallet()!
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xpringClient.send(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeNetworkClientResponses.defaultError.message,
      )
      done()
    })
  })

  it('Check if account exists - successful network request', async function() {
    // GIVEN a DefaultXpringClient.
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)

    // WHEN the account does exist
    const exists = await xpringClient.accountExists(testAddress)

    // THEN accountExists returns true
    assert.equal(exists, true)
  })

  it('Check if account exists - failing network request', async function() {
    // GIVEN a XpringClient which wraps an erroring network client.
    const xpringClient = new DefaultXpringClient(fakeErroringNetworkClient)

    // WHEN accountExists throws an exception while calling getBalance
    const exists = await xpringClient.accountExists(testAddress)

    // THEN accountExists returns false
    assert.equal(exists, false)
  })

  it('Check if account exists - error with classic address', function(done) {
    // GIVEN a XpringClient and a classic address
    const xpringClient = new DefaultXpringClient(fakeSucceedingNetworkClient)
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN accountExists is called using a classic address THEN an error to use X-Addresses is thrown.
    xpringClient.accountExists(classicAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.message, XpringClientErrorMessages.xAddressRequired)
      done()
    })
  })
})
