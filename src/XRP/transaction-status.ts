/** Represents statuses of transactions. */
enum TransactionStatus {
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

  /** The transaction was included in a finalized ledger and succeeded. */
  Unknown,
}

export default TransactionStatus
