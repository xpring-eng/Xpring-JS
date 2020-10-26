import TransactionStatus from '../shared/transaction-status'

/**
 * Represents the outcome of submitting an XRPL transaction.
 */
export default class TransactionResult {
  /**
   * Constructs a TransactionResult in the case where the result is not final.
   * The outcome of a transaction is not final if it has not yet been included in
   * a validated ledger but still has a valid lastLedgerSequence field.
   * @see https://xrpl.org/reliable-transaction-submission.html#lastledgersequence
   *
   * @param hash The identifying hash of the transaction.
   * @param status The result of the transaction.
   * @param validated Whether this transaction (and status) are included in a validated ledger.
   */
  public static createPendingTransactionResult(
    hash: string,
    status: TransactionStatus,
    validated: boolean,
  ): TransactionResult {
    return new TransactionResult(hash, status, validated, false)
  }

  /**
   * Constructs a TransactionResult in the case where the result is final.
   * The outcome of a transaction is final if it has been included in a validated
   * ledger, or has not been included in a validated ledger but has a lastLedgerSequence field
   * that has been equaled or surpassed by the sequence number of the latest validated ledger.
   * @see https://xrpl.org/reliable-transaction-submission.html#lastledgersequence
   *
   * @param hash The identifying hash of the transaction.
   * @param status The result of the transaction.
   * @param validated Whether this transaction (and status) are included in a validated ledger.
   */
  public static createFinalTransactionResult(
    hash: string,
    status: TransactionStatus,
    validated: boolean,
  ): TransactionResult {
    return new TransactionResult(hash, status, validated, true)
  }

  /**
   * @param hash The identifying hash of the transaction.
   * @param status The result of the transaction.
   * @param validated Whether this transaction (and status) are included in a validated ledger.
   * @param final Whether this transaction result is the final outcome of the transaction on the XRPL.
   *              The `status` and `validated` fields are subject to change unless this field is true.
   */
  private constructor(
    public readonly hash: string,
    public readonly status: TransactionStatus,
    public readonly validated: boolean,
    public readonly final: boolean,
  ) {}
}
