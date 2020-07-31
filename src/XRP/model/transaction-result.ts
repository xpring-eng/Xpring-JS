import TransactionStatus from '../transaction-status'

/**
 * Represents the outcome of submitting an XRPL transaction.
 */
export default class TransactionResult {
  hash: string
  status: TransactionStatus
  validated: boolean

  /**
   *
   * @param hash The identifying hash of the transaction.
   * @param status The final result of the transaction.
   * @param validated Whether this transaction (and status) are included in a validated ledger.
   *                  The transaction status is only final if this field is true.
   */
  public constructor(
    hash: string,
    status: TransactionStatus,
    validated: boolean,
  ) {
    this.hash = hash
    this.status = status
    this.validated = validated
  }
}
