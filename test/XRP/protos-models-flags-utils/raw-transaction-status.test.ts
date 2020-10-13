import 'mocha'
import { assert } from 'chai'

import { Flags } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/common_pb'
import { GetTransactionResponse } from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import {
  Transaction,
  Payment,
} from '../../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'
import RawTransactionStatus from '../../../src/XRP/shared/raw-transaction-status'
import PaymentFlags from '../../../src/XRP/shared/payment-flags'
import {
  Meta,
  TransactionResult,
} from '../../../src/XRP/Generated/node/org/xrpl/rpc/v1/meta_pb'

describe('raw transaction status', function (): void {
  it('isFullPayment - non payment', function (): void {
    // GIVEN a getTxResponse which is not a payment.
    const transaction = new Transaction()
    transaction.clearPayment()

    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')
    const meta = new Meta()
    meta.setTransactionResult(transactionResult)
    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)
    getTxResponse.setMeta(meta)

    // WHEN the raw transaction status is wrapped in a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not a full payment.
    assert.isFalse(rawTransactionStatus.isFullPayment)
  })

  it('isFullPayment - partial payment', function (): void {
    // GIVEN a getTxResponse which is a payment with the partial payment flags set.
    const payment = new Payment()

    const flags = new Flags()
    flags.setValue(PaymentFlags.TF_PARTIAL_PAYMENT)

    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')
    const meta = new Meta()
    meta.setTransactionResult(transactionResult)
    const transaction = new Transaction()
    transaction.setPayment(payment)
    transaction.setFlags(flags)

    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)
    getTxResponse.setMeta(meta)

    // WHEN the raw transaction status is wrapped in a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is not a full payment.
    assert.isFalse(rawTransactionStatus.isFullPayment)
  })

  it('isFullPayment - payment', function (): void {
    // GIVEN a getTxResponse which is a payment.
    const payment = new Payment()

    const transaction = new Transaction()
    transaction.setPayment(payment)

    const transactionResult = new TransactionResult()
    transactionResult.setResult('tesSUCCESS')
    const meta = new Meta()
    meta.setTransactionResult(transactionResult)
    const getTxResponse = new GetTransactionResponse()
    getTxResponse.setTransaction(transaction)
    getTxResponse.setMeta(meta)

    // WHEN the raw transaction status is wrapped in a RawTransactionStatus object.
    const rawTransactionStatus = RawTransactionStatus.fromGetTransactionResponse(
      getTxResponse,
    )

    // THEN the raw transaction status reports it is a full payment.
    assert.isTrue(rawTransactionStatus.isFullPayment)
  })
})
