/**
 * Types of transactions on the XRP Ledger.
 *
 * This is a partial list. Please file an issue if you have a use case that requires additional types.
 *
 * @see: https://xrpl.org/transaction-formats.html
 *
 * @deprecated Use XrpTransactionType.
 */
export enum XRPTransactionType {
  Payment,
}

/**
 * Types of transactions on the XRP Ledger.
 *
 * This is a partial list. Please file an issue if you have a use case that requires additional types.
 *
 * @see: https://xrpl.org/transaction-formats.html
 */
enum XrpTransactionType {
  Payment,
  AccountSet,
  AccountDelete,
  CheckCancel,
  CheckCash,
}

export default XrpTransactionType
