/** Represents statuses of transactions. */
enum TransactionStatus {
  /** The transaction was included in a finalized ledger and failed. */
  Failed,

  /** The transaction is not included in a finalized ledger. */
  Pending,

  /** The transaction was included in a finalized ledger and succeeded. */
  Succeeded,

  /** The transaction was included in a finalized ledger and succeeded. */
  Unknown,
}

export default TransactionStatus
