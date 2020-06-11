/**
 * Types of transactions on the XRP Ledger.
 *
 * This is a partial list. Please file an issue if you have a use case that requires additional types.
 *
 * @see: https://xrpl.org/transaction-formats.html
 */
enum XRPTransactionType {
  Payment,
  AccountSet,
  AccountDelete,
  CheckCancel,
  CheckCash,
  CheckCreate,
  DepositPreauth,
  EscrowCancel,
  EscrowCreate,
  EscrowFinish,
  OfferCancel,
}

export default XRPTransactionType
