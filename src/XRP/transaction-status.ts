/** Represents statuses of transactions. */
enum TransactionStatus {
  /** The transaction was included in a finalized ledger and failed. */
  Failed,

  /** The transaction is not included in a finalized ledger, and is not valid, due to improper syntax, conflicting options, a bad signature, or something else. */
  MalformedTransaction,

  /** The transaction is not included in a finalized ledger. */
  Pending,

  /** The transaction was included in a finalized ledger and succeeded. */
  Succeeded,

  /** The transaction was included in a finalized ledger and succeeded. */
  Unknown,
}

export default TransactionStatus
