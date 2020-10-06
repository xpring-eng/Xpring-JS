/**
 * Flags used in AccountSet transactions.
 *
 * @see https://xrpl.org/accountset.html#accountset-flags
 */
export enum AccountSetFlag {
  asfRequireDest = 1,
  asfRequireAuth = 2,
  asfDisallowXRP = 3,
  asfDisableMaster = 4,
  asfAccountTxnID = 5,
  asfNoFreeze = 6,
  asfGlobalFreeze = 7,
  asfDefaultRipple = 8,
  asfDepositAuth = 9,
}
