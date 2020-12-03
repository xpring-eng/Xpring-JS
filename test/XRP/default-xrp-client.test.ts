/* eslint-disable no-restricted-syntax */
import { assert } from 'chai'

import bigInt from 'big-integer'
import { Utils, WalletFactory, XrplNetwork } from 'xpring-common-js'
import { StatusCode as grpcStatusCode } from 'grpc-web'
import FakeGRPCError from '../Common/Fakes/fake-grpc-error'
import XRPTestUtils, { iForgotToPickUpCarlMemo } from './helpers/xrp-test-utils'
import DefaultXrpClient from '../../src/XRP/default-xrp-client'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import 'mocha'
import { GetTransactionResponse } from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  Meta,
  TransactionResult,
} from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/meta_pb'
import TransactionStatus from '../../src/XRP/shared/transaction-status'
import { Transaction } from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import {
  testGetAccountTransactionHistoryResponse,
  testCheckCashTransaction,
  testGetTransactionResponseProto,
  testInvalidGetTransactionResponseProto,
  testInvalidGetTransactionResponseProtoUnsupportedType,
  testInvalidGetAccountTransactionHistoryResponse,
} from './fakes/fake-xrp-protobufs'
import XrpTransaction from '../../src/XRP/protobuf-wrappers/xrp-transaction'
import XrpError, { XrpErrorType } from '../../src/XRP/shared/xrp-error'

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const transactionStatusCodeSuccess = 'tesSUCCESS'
const transactionStatusFailureCodes = [
  'tefFAILURE',
  'tecCLAIM',
  'telBAD_PUBLIC_KEY',
  'temBAD_FEE',
  'terRETRY',
  'tecPATH_PARTIAL',
  'tecPATH_DRY',
]

const transactionHash = 'DEADBEEF'

const walletFactory = new WalletFactory(XrplNetwork.Test)

const fakeSucceedingNetworkClient = new FakeXRPNetworkClient()
const fakeErroringNetworkClient = new FakeXRPNetworkClient(
  FakeXRPNetworkClientResponses.defaultErrorResponses,
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

describe('Default XRP Client', function (): void {
  it('Get Account Balance - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the balance for an account is requested.
    const balance = await xrpClient.getBalance(testAddress)

    // THEN the balance is returned.
    assert.exists(balance)
  })

  it('Get Account Balance - classic address', function (done): void {
    // GIVEN a DefaultXrpClient and a classic address
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the balance for an account is requested THEN an error to use X-Addresses is thrown.
    xrpClient.getBalance(classicAddress).catch((error) => {
      assert.equal((error as XrpError).errorType, XrpErrorType.XAddressRequired)
      done()
    })
  })

  it('Get Account Balance - error', function (done): void {
    // GIVEN a DefaultXrpClient which wraps an erroring network client.
    const xrpClient = new DefaultXrpClient(
      fakeErroringNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN a balance is requested THEN an error is propagated.
    xrpClient.getBalance(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, FakeXRPNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Get Account Balance - malformed response, no balance', function (done): void {
    // GIVEN a DefaultXrpClient which wraps a network client with a malformed response.
    const accountInfoResponse = FakeXRPNetworkClientResponses.defaultAccountInfoResponse()
    accountInfoResponse.getAccountData()!.setBalance(undefined)
    const fakeNetworkClientResponses = new FakeXRPNetworkClientResponses(
      accountInfoResponse,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      fakeNetworkClientResponses,
    )
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN a balance is requested THEN an error is propagated.
    xrpClient.getBalance(testAddress).catch((error) => {
      assert.equal(
        (error as XrpError).errorType,
        XrpErrorType.MalformedResponse,
      )
      done()
    })
  })

  it('Get Payment Status - Unvalidated Transaction and Failure Code', async function (): Promise<void> {
    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN a DefaultXrpClient which will return an unvalidated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
      const transactionStatusResponse = makeGetTransactionResponse(
        false,
        transactionStatusCodeFailure,
      )
      const transactionStatusResponses = new FakeXRPNetworkClientResponses(
        FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
        FakeXRPNetworkClientResponses.defaultFeeResponse(),
        FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
        transactionStatusResponse,
      )
      const fakeNetworkClient = new FakeXRPNetworkClient(
        transactionStatusResponses,
      )
      const xrpClient = new DefaultXrpClient(
        fakeNetworkClient,
        XrplNetwork.Test,
      )

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xrpClient.getPaymentStatus(
        transactionHash,
      )

      // THEN the status is pending.
      assert.deepEqual(transactionStatus, TransactionStatus.Pending)
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Payment Status - Unvalidated Transaction and Success Code', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient which will return an unvalidated transaction with a success code.
    const transactionStatusResponse = makeGetTransactionResponse(
      false,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      transactionStatusResponses,
    )
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xrpClient.getPaymentStatus(transactionHash)

    // THEN the status is pending.
    assert.deepEqual(transactionStatus, TransactionStatus.Pending)
  })

  it('Get Payment Status - Validated Transaction and Failure Code', async function (): Promise<void> {
    const expectedTransactionStatusFailureCodeResponses: number[] = [
      TransactionStatus.Failed,
      TransactionStatus.ClaimedCostOnly,
      TransactionStatus.Unknown,
      TransactionStatus.MalformedTransaction,
      TransactionStatus.Unknown,
      TransactionStatus.ClaimedCostOnly_PathPartial,
      TransactionStatus.ClaimedCostOnly_PathDry,
    ]

    // Iterate over different types of transaction status codes which represent failures.
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < transactionStatusFailureCodes.length; i += 1) {
      // GIVEN a DefaultXrpClient which will return an validated transaction with a failure code.
      const transactionStatusCodeFailure = transactionStatusFailureCodes[i]
      const transactionStatusResponse = makeGetTransactionResponse(
        true,
        transactionStatusCodeFailure,
      )
      const transactionStatusResponses = new FakeXRPNetworkClientResponses(
        FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
        FakeXRPNetworkClientResponses.defaultFeeResponse(),
        FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
        transactionStatusResponse,
      )
      const fakeNetworkClient = new FakeXRPNetworkClient(
        transactionStatusResponses,
      )
      const xrpClient = new DefaultXrpClient(
        fakeNetworkClient,
        XrplNetwork.Test,
      )

      // WHEN the transaction status is retrieved.
      const transactionStatus = await xrpClient.getPaymentStatus(
        transactionHash,
      )

      // THEN the status is as expected.
      assert.deepEqual(
        transactionStatus,
        expectedTransactionStatusFailureCodeResponses[i],
      )
    }
    /* eslint-enable no-await-in-loop */
  })

  it('Get Payment Status - Validated Transaction and Success Code', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient which will return an validated transaction with a success code.
    const transactionStatusResponse = makeGetTransactionResponse(
      true,
      transactionStatusCodeSuccess,
    )
    const transactionStatusResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      transactionStatusResponse,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      transactionStatusResponses,
    )
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN the transaction status is retrieved.
    const transactionStatus = await xrpClient.getPaymentStatus(transactionHash)

    // THEN the status is succeeded.
    assert.deepEqual(transactionStatus, TransactionStatus.Succeeded)
  })

  it('Get Transaction Status - Node Error', function (done): void {
    // GIVEN a DefaultXrpClient which will error when a transaction status is requested.
    const transactionStatusResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(
      transactionStatusResponses,
    )
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN the transaction status is retrieved THEN an error is thrown.
    xrpClient.getPaymentStatus(transactionHash).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Send XRP Transaction - success with memo and BigInteger', async function () {
    // GIVEN a DefaultXrpClient, a wallet, and a BigInteger denominated amount and a memo.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')
    const memoList = [iForgotToPickUpCarlMemo]

    // WHEN the account makes a transaction with a memo.
    const transactionResult = await xrpClient.sendXrpWithDetails({
      amount,
      destination: destinationAddress,
      sender: wallet,
      memoList,
    })

    // THEN the transaction hash exists and finds the transaction with the memo.
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with BigInteger', async function () {
    // GIVEN a DefaultXrpClient, a wallet, and a BigInteger denomonated amount.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN the account makes a transaction.
    const transactionResult = await xrpClient.sendXrp(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with number', async function () {
    // GIVEN a DefaultXrpClient, a wallet, and a number denominated amount.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 10

    // WHEN the account makes a transaction.
    const transactionResult = await xrpClient.sendXrp(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('Send XRP Transaction - success with string', async function () {
    // GIVEN a DefaultXrpClient, a wallet, and a numeric string denominated amount.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = '10'

    // WHEN the account makes a transaction.
    const transactionResult = await xrpClient.sendXrp(
      amount,
      destinationAddress,
      wallet,
    )

    // THEN the transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionResult.hash)
    assert.strictEqual(transactionResult.hash, expectedTransactionHash)
  })

  it('Send XRP Transaction - failure with invalid string', async function () {
    // GIVEN a DefaultXrpClient, a wallet and an amount that is invalid.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = 'not_a_number'

    // WHEN the account makes a transaction THEN an error is propagated.
    xrpClient.sendXrp(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
    })
  })

  it('Send XRP Transaction - get fee failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to retrieve a fee.
    const feeFailureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultError,
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeXRPNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new DefaultXrpClient(
      feeFailingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.sendXrp(amount, destinationAddress, wallet).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(
        error.message,
        FakeXRPNetworkClientResponses.defaultError.message,
      )
    })
  })

  it('Send XRP Transaction - failure with classic address', async function () {
    // GIVEN a DefaultXrpClient, a wallet, and a classic address as the destination.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'
    const amount = bigInt('10')

    // WHEN the account makes a transaction THEN an error is thrown.
    xrpClient.sendXrp(amount, destinationAddress, wallet).catch((error) => {
      assert.equal((error as XrpError).errorType, XrpErrorType.XAddressRequired)
    })
  })

  it('Send XRP Transaction - get account info failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to retrieve account info.
    const feeFailureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultError,
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
    )
    const feeFailingNetworkClient = new FakeXRPNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new DefaultXrpClient(
      feeFailingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.sendXrp(amount, destinationAddress, wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('Send XRP Transaction - submission failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to submit a transaction.
    const feeFailureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const feeFailingNetworkClient = new FakeXRPNetworkClient(
      feeFailureResponses,
    )
    const xrpClient = new DefaultXrpClient(
      feeFailingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet
    const destinationAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const amount = bigInt('10')

    // WHEN a payment is attempted THEN an error is propagated.
    xrpClient.sendXrp(amount, destinationAddress, wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('Check if account exists - successful network request', async function () {
    // GIVEN a DefaultXrpClient.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the account does exist
    const exists = await xrpClient.accountExists(testAddress)

    // THEN accountExists returns true
    assert.equal(exists, true)
  })

  it('Check if account exists - failing network request w/ NOT_FOUND error', async function () {
    // GIVEN a DefaultXrpClient with a network client that will report accounts as not found
    const notFoundError = new FakeGRPCError(
      grpcStatusCode.NOT_FOUND,
      'FakeGRPCError: account not found',
    )
    const fakeNetworkClientResponses = new FakeXRPNetworkClientResponses(
      notFoundError, // getAccountInfoResponse
    )
    const fakeErroringNetworkClient = new FakeXRPNetworkClient(
      fakeNetworkClientResponses,
    )
    const xrpClient = new DefaultXrpClient(
      fakeErroringNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN Account existence is checked
    const exists = await xrpClient.accountExists(testAddress)

    // THEN the account is reported not to exist
    assert.equal(exists, false)
  })

  it('Check if account exists - failing network request w/ CANCELLED error', function (done) {
    // GIVEN a DefaultXrpClient with a network client that reports grpc operation as cancelled
    const cancelledError = new FakeGRPCError(
      grpcStatusCode.CANCELLED,
      'FakeGRPCError: operation was cancelled',
    )
    const fakeNetworkClientResponses = new FakeXRPNetworkClientResponses(
      cancelledError, // getAccountInfoResponse
    )
    const fakeErroringNetworkClient = new FakeXRPNetworkClient(
      fakeNetworkClientResponses,
    )
    const xrpClient = new DefaultXrpClient(
      fakeErroringNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN Account existence is checked
    // THEN an error is re-thrown (cannot conclude account doesn't exist)
    xrpClient.accountExists(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.code, grpcStatusCode.CANCELLED)
      done()
    })
  })

  it('Check if account exists - error with classic address', function (done) {
    // GIVEN a DefaultXrpClient and a classic address
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN accountExists is called using a classic address THEN an error to use X-Addresses is thrown.
    xrpClient.accountExists(classicAddress).catch((error) => {
      assert.equal((error as XrpError).errorType, XrpErrorType.XAddressRequired)
      done()
    })
  })

  it('Payment History - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the payment history for an address is requested.
    const paymentHistory = await xrpClient.paymentHistory(testAddress)

    const expectedPaymentHistory: Array<XrpTransaction> = XRPTestUtils.transactionHistoryToPaymentsList(
      testGetAccountTransactionHistoryResponse,
    )
    // THEN the payment history is returned as expected
    assert.deepEqual(expectedPaymentHistory, paymentHistory)
  })

  it('Payment History - classic address', function (done): void {
    // GIVEN a DefaultXrpClient and a classic address
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )
    const classicAddress = 'rsegqrgSP8XmhCYwL9enkZ9BNDNawfPZnn'

    // WHEN the payment history for an account is requested THEN an error to use X-Addresses is thrown.
    xrpClient.paymentHistory(classicAddress).catch((error) => {
      assert.equal((error as XrpError).errorType, XrpErrorType.XAddressRequired)
      done()
    })
  })

  it('Payment History - network failure', function (done): void {
    // GIVEN a DefaultXrpClient which wraps an erroring network client.
    const xrpClient = new DefaultXrpClient(
      fakeErroringNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the payment history is requested THEN an error is propagated.
    xrpClient.paymentHistory(testAddress).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      done()
    })
  })

  it('Payment History - non-payment transactions', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient client which will return a transaction history which contains non-payment transactions

    // Generate expected transactions from the default response, which only contains payments.
    const nonPaymentTransactionResponse = new GetTransactionResponse()
    nonPaymentTransactionResponse.setTransaction(testCheckCashTransaction)
    // add CHECKCASH transaction - history then contains payment and non-payment transactions
    const heteregeneousTransactionHistory = testGetAccountTransactionHistoryResponse.clone()
    heteregeneousTransactionHistory.addTransactions(
      nonPaymentTransactionResponse,
    )

    const heteroHistoryNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeXRPNetworkClientResponses.defaultGetTransactionResponse(),
      heteregeneousTransactionHistory,
    )

    const heteroHistoryNetworkClient = new FakeXRPNetworkClient(
      heteroHistoryNetworkResponses,
    )

    const xrpClient = new DefaultXrpClient(
      heteroHistoryNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the transactionHistory is requested.
    const transactionHistory = await xrpClient.paymentHistory(testAddress)

    // THEN the returned transactions are conversions of the inputs with non-payment transactions filtered.
    const expectedTransactionHistory: Array<XrpTransaction> = XRPTestUtils.transactionHistoryToPaymentsList(
      testGetAccountTransactionHistoryResponse,
    )

    assert.deepEqual(expectedTransactionHistory, transactionHistory)
  })

  it('Payment History - invalid Payment', function (done) {
    // GIVEN a DefaultXrpClient client which will return a transaction history which contains a malformed payment.
    const invalidHistoryNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      FakeXRPNetworkClientResponses.defaultGetTransactionResponse(),
      testInvalidGetAccountTransactionHistoryResponse, // contains malformed payment
    )
    const invalidHistoryNetworkClient = new FakeXRPNetworkClient(
      invalidHistoryNetworkResponses,
    )
    const xrpClient = new DefaultXrpClient(
      invalidHistoryNetworkClient,
      XrplNetwork.Test,
    )

    // WHEN the transactionHistory is requested THEN a conversion error is thrown.
    xrpClient.paymentHistory(testAddress).catch((error) => {
      assert.equal(
        (error as XrpError).errorType,
        XrpErrorType.MalformedProtobuf,
      )
      done()
    })
  })

  it('Get Payment - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will succeed for getTransaction.
    const fakeNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      testGetTransactionResponseProto,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(fakeNetworkResponses)
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN a transaction is requested.
    const transaction = await xrpClient.getPayment(transactionHash)

    // THEN the returned transaction is as expected.
    assert.deepEqual(
      transaction,
      XrpTransaction.from(testGetTransactionResponseProto, xrpClient.network),
    )
  })

  it('Get Payment - failing network request with NOT_FOUND error', function (done) {
    // GIVEN a DefaultXrpClient with mocked networking that will fail to retrieve a transaction w/ NOT_FOUND error code.
    const notFoundError = new FakeGRPCError(
      grpcStatusCode.NOT_FOUND,
      'FakeGRPCError: account not found',
    )
    const fakeNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      notFoundError,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(fakeNetworkResponses)
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN a transaction is requested, THEN the error is re-thrown.
    xrpClient.getPayment(transactionHash).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error.code, grpcStatusCode.NOT_FOUND)
      done()
    })
  })

  it('Get Payment - malformed payment transaction', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will return a malformed payment transaction.
    const fakeNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      testInvalidGetTransactionResponseProto,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(fakeNetworkResponses)
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN a transaction is requested THEN an error is thrown.
    try {
      await xrpClient.getPayment(transactionHash)
      assert.fail('No error thrown.')
    } catch (e) {
      assert(e.message.includes('Payment protobuf'))
    }
  })

  it('Get Payment - unsupported transaction type', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will return an unsupported transaction type.
    const fakeNetworkResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse(),
      testInvalidGetTransactionResponseProtoUnsupportedType,
    )
    const fakeNetworkClient = new FakeXRPNetworkClient(fakeNetworkResponses)
    const xrpClient = new DefaultXrpClient(fakeNetworkClient, XrplNetwork.Test)

    // WHEN a transaction is requested.
    try {
      await xrpClient.getPayment(transactionHash)
      assert.fail('No error thrown.')
    } catch (e) {
      assert(e.message.includes('Transaction protobuf'))
    }
  })

  it('Enable Deposit Auth - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will return a successful hash for submitTransaction
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN enableDepositAuth is called
    const result = await xrpClient.enableDepositAuth(wallet)
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('Enable Deposit Auth - submission failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const xrpClient = new DefaultXrpClient(
      failingNetworkClient,
      XrplNetwork.Test,
    )
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN enableDepositAuth is attempted THEN an error is propagated.
    xrpClient.enableDepositAuth(wallet).catch((error) => {
      assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
    })
  })

  it('Authorize DepositPreauth - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will return a successful hash for submitTransaction.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToAuthorize =
      'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN authorizeSendingAccount is called.
    const result = await xrpClient.authorizeSendingAccount(
      xAddressToAuthorize,
      wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash.
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('authorizeSendingAccount - submission failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const xrpClient = new DefaultXrpClient(
      failingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToAuthorize =
      'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN authorizeSendingAccount is attempted THEN an error is propagated.
    xrpClient
      .authorizeSendingAccount(xAddressToAuthorize, wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('authorizeSendingAccount - failure with malformed sender X-Address', async function () {
    // GIVEN a DefaultXrpClient with mocked networking.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToAuthorize = 'notanxaddress'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN authorizeSendingAccount is attempted THEN an error is propagated.
    xrpClient
      .authorizeSendingAccount(xAddressToAuthorize, wallet)
      .catch((error) => {
        assert.deepEqual(error, XrpError.xAddressRequired)
      })
  })

  it('unauthorizeSendingAccount - successful response', async function (): Promise<void> {
    // GIVEN a DefaultXrpClient with mocked networking that will return a successful hash for submitTransaction.
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToUnauthorize =
      'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN unauthorizeSendingAccount is called.
    const result = await xrpClient.unauthorizeSendingAccount(
      xAddressToUnauthorize,
      wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash.
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('unauthorizeSendingAccount - submission failure', async function () {
    // GIVEN a DefaultXrpClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const xrpClient = new DefaultXrpClient(
      failingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToUnauthorize =
      'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN unauthorizeSendingAccount is attempted THEN an error is propagated.
    xrpClient
      .unauthorizeSendingAccount(xAddressToUnauthorize, wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })

  it('unauthorizeSendingAccount - failure with malformed sender X-Address', async function () {
    // GIVEN a DefaultXrpClient with mocked networking
    const xrpClient = new DefaultXrpClient(
      fakeSucceedingNetworkClient,
      XrplNetwork.Test,
    )

    const xAddressToUnauthorize = 'notanxaddress'
    const wallet = (await walletFactory.generateRandomWallet())!.wallet

    // WHEN unauthorizeSendingAccount is attempted THEN an error is propagated.
    xrpClient
      .unauthorizeSendingAccount(xAddressToUnauthorize, wallet)
      .catch((error) => {
        assert.deepEqual(error, XrpError.xAddressRequired)
      })
  })
})
