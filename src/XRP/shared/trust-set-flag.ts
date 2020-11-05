/**
 * Flags used in TrustSet transactions.
 *
 * @see https://xrpl.org/trustset.html#trustset-flags
 */
enum TrustSetFlag {
  tfSetfAuth = 0x00010000,
  tfSetFreeze = 0x00100000,
  tfClearFreeze = 0x00200000,
}

export default TrustSetFlag
