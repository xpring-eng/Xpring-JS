import { assert } from 'chai'
import RippledFlags from '../src/rippled-flags'
import { GetTransactionResponse } from '../src/generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  Transaction,
  Payment,
} from '../src/generated/web/org/xrpl/rpc/v1/transaction_pb'
import { TransactionStatus as LegacyTransactionStatus } from '../src/generated/web/legacy/transaction_status_pb'
import 'mocha'
import RawTransactionStatus from '../src/raw-transaction-status'
import { Flags } from '../src/generated/web/org/xrpl/rpc/v1/common_pb'

describe('raw transaction status', function(): void {
  it('isFullPayment - legacy proto', function(): void {
    // GIVEN a legacy transaction status protocol buffer.
    const transactionStatus = new LegacyTransactionStatus()

    // WHEN the transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromTransactionStatus(
      transactionStatus,
    )

    // THEN the raw transaction status reports it is a full payment.
    assert.isTrue(rawTransactionStatus.isFullPayment)
  })

  it('isFullPayment - non payment', function(): void {
    // GIVEN a getTxResponse which is not a payment.
    const transaction = new Transaction()
    transaction.clearPayment()

    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not a full payment.
    assert.isFalse(rawTransactionStatus.isFullPayment)
  })

  it('isFullPayment - partial payment', function(): void {
    // GIVEN a getTxResponse which is a payment with the partial payment flags set.
    const payment = new Payment()

    const flags = new Flags()
    flags.setValue(RippledFlags.TF_PARTIAL_PAYMENT)

    const transaction = new Transaction()
    transaction.setPayment(payment)
    transaction.setFlags(flags)

    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not a full payment.
    assert.isFalse(rawTransactionStatus.isFullPayment)
  })

  it('isFullPayment - payment', function(): void {
    // GIVEN a getTxResponse which is a payment.
    const payment = new Payment()

    const transaction = new Transaction()
    transaction.setPayment(payment)

    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)

    // WHEN the raw transaction status is wrapped into a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is a full payment.
    assert.isTrue(rawTransactionStatus.isFullPayment)
  })
})
