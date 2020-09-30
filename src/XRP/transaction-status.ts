/** Represents statuses of transactions. */
enum TransactionStatus {
  /** The transaction was included in a finalized ledger and failed. */
  Failed,

  /** The transaction is not included in a finalized ledger. */
  Pending,

  /** The transaction was included in a finalized ledger and succeeded. */
  Succeeded,

  /** The transaction's last ledger sequence has been passed - the transaction cannot be included in a validated ledger. */
  LastLedgerPassed,

  /** The transaction was included in a finalized ledger and succeeded. */
  Unknown,
}

export default TransactionStatus
