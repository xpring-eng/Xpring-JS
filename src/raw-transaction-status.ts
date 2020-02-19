import { TransactionStatus } from './generated/web/legacy/transaction_status_pb'
import { GetTxResponse } from './generated/web/rpc/v1/tx_pb'

/** Abstraction around raw Transaction Status for compatibility. */
export default class RawTransactionStatus {
  /**
   * Create a RawTransactionStatus from a TransactionStatus legacy protocol buffer.
   */
  public static fromTransactionStatus(
    transactionStatus: TransactionStatus,
  ): RawTransactionStatus {
    return new RawTransactionStatus(
      transactionStatus.getValidated(),
      transactionStatus.getTransactionStatusCode(),
      transactionStatus.getLastLedgerSequence(),
    )
  }

  /**
   * Create a RawTransactionStatus from a GetTxResponse protocol buffer.
   */
  public static fromGetTxResponse(
    getTxResponse: GetTxResponse,
  ): RawTransactionStatus {
    return new RawTransactionStatus(
      getTxResponse.getValidated(),
      getTxResponse
        .getMeta()
        ?.getTransactionResult()
        ?.getResult(),
      getTxResponse.getTransaction()?.getLastLedgerSequence(),
    )
  }

  /**
   * Note: This constructor is exposed for testing purposes. Clients of this code should favor using a static factory method.
   */
  public constructor(
    public isValidated,
    public transactionStatusCode,
    public lastLedgerSequence,
  ) {}
}
