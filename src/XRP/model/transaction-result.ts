import TransactionStatus from '../transaction-status'

/**
 * Represents the outcome of submitting an XRPL transaction.
 */
export default class TransactionResult {
  /**
   * @param hash The identifying hash of the transaction.
   * @param status The result of the transaction.
   * @param validated Whether this transaction (and status) are included in a validated ledger.
   * @param final Whether this transaction result is the final outcome of the transaction on the XRPL.
   *              The `status` and `validated` fields are subject to change unless this field is true.
   */
  public constructor(
    public readonly hash: string,
    public readonly status: TransactionStatus,
    public readonly validated: boolean,
    public readonly final: boolean,
  ) {}
}
