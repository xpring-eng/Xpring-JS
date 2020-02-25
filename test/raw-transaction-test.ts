import { assert } from 'chai'
import RippledFlags from '../src/rippled-flags'
import { GetTxResponse } from '../src/generated/web/rpc/v1/tx_pb'
import {
  Transaction,
  Payment,
} from '../src/generated/web/rpc/v1/transaction_pb'
import { TransactionStatus as LegacyTransactionStatus } from '../src/generated/web/legacy/transaction_status_pb'
import 'mocha'
import RawTransactionStatus from '../src/raw-transaction-status'

describe('raw transaction status', function(): void {
  it('isBucketable - legacy proto', function(): void {
    // GIVEN a legacy transaction status protocol buffer.
    const transactionStatus = new LegacyTransactionStatus()

    // WHEN the transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromTransactionStatus(
      transactionStatus,
    )

    // THEN the raw transaction status reports it is bucketable.
    assert.isTrue(rawTransactionStatus.isBucketable)
  })

  it('isBucketable - non payment', function(): void {
    // GIVEN a getTxResponse which is not a payment.
    const transaction = new Transaction()
    transaction.clearPayment()

    const getTxResponse = new GetTxResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTxResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not bucketable.
    assert.isFalse(rawTransactionStatus.isBucketable)
  })

  it('isBucketable - partial payment', function(): void {
    // GIVEN a getTxResponse which is a payment with the partial payment flags set.
    const payment = new Payment()

    const transaction = new Transaction()
    transaction.setPayment(payment)
    transaction.setFlags(RippledFlags.TF_PARTIAL_PAYMENT)

    const getTxResponse = new GetTxResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTxResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not bucketable.
    assert.isFalse(rawTransactionStatus.isBucketable)
  })

  it('isBucketable - payment', function(): void {
    // GIVEN a getTxResponse which is a payment.
    const payment = new Payment()

    const transaction = new Transaction()
    transaction.setPayment(payment)

    const getTxResponse = new GetTxResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTxResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is bucketable.
    assert.isTrue(rawTransactionStatus.isBucketable)
  })
})
