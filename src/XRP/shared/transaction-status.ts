/** Represents statuses of transactions. */
enum TransactionStatus {
  /**
   * The transaction failed because the provided paths did not have enough liquidity to send anything at all.
   * This could mean that the source and destination accounts are not linked by trust lines.
   * The transaction cost was destroyed.
   */
  ClaimedCostOnly_PathDry,

  /**
   * The transaction failed because the provided paths did not have enough liquidity to send the full amount.
   * The transaction cost was destroyed.
   */
  ClaimedCostOnly_PathPartial,

  /** The transaction did not achieve its intended purpose, but the transaction cost was destroyed. */
  ClaimedCostOnly,

  /** The transaction is not included in a finalized ledger, and is not valid, due to improper syntax, conflicting options, a bad signature, or something else. */
  MalformedTransaction,

  /** The transaction was included in a finalized ledger and failed. */
  Failed,

  /** The transaction is not included in a finalized ledger. */
  Pending,

  /** The transaction was included in a finalized ledger and succeeded. */
  Succeeded,

  /** The transaction's last ledger sequence has been surpassed; the transaction will never be included in a validated ledger. */
  LastLedgerSequenceExpired,

  /** The transaction status is unknown. */
  Unknown,
}

export default TransactionStatus
