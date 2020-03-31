import { TransactionStatus } from './Generated/web/legacy/transaction_status_pb'
import { GetTransactionResponse } from './Generated/web/org/xrpl/rpc/v1/get_transaction_pb'
import RippledFlags from './rippled-flags'

/** Abstraction around raw Transaction Status for compatibility. */
export default class RawTransactionStatus {
  /**
   * Create a RawTransactionStatus from a TransactionStatus legacy protocol buffer.
   */
  static fromTransactionStatus(
    transactionStatus: TransactionStatus,
  ): RawTransactionStatus {
    return new RawTransactionStatus(
      transactionStatus.getValidated(),
      transactionStatus.getTransactionStatusCode(),
      transactionStatus.getLastLedgerSequence(),
      true,
    )
  }

  /**
   * Create a RawTransactionStatus from a GetTransactionResponse protocol buffer.
   */
  static fromGetTransactionResponse(
    getTransactionResponse: GetTransactionResponse,
  ): RawTransactionStatus {
    const transaction = getTransactionResponse.getTransaction()
    if (!transaction) {
      throw new Error(
        'Malformed input, `getTxResponse` did not contain a transaction.',
      )
    }

    const isPayment = transaction.hasPayment()
    const flags = transaction.getFlags()?.getValue() ?? 0

    const isPartialPayment = RippledFlags.checkFlag(
      RippledFlags.TF_PARTIAL_PAYMENT,
      flags,
    )

    const isFullPayment = isPayment && !isPartialPayment

    return new RawTransactionStatus(
      getTransactionResponse.getValidated(),
      getTransactionResponse
        .getMeta()
        ?.getTransactionResult()
        ?.getResult(),
      getTransactionResponse.getTransaction()?.getLastLedgerSequence(),
      isFullPayment,
    )
  }

  /**
   * Note: This constructor is exposed for testing purposes. Clients of this code should favor using a static factory method.
   */
  constructor(
    public isValidated,
    public transactionStatusCode,
    public lastLedgerSequence,
    public isFullPayment,
  ) {}
}
