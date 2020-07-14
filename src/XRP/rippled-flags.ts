/* eslint-disable no-bitwise */

/**
 * Flags used in rippled transactions.
 *
 * @note These are only flags which are utilized in Xpring SDK. For a complete list of flags, see: https://xrpl.org/transaction-common-fields.html#flags-field.
 */
class RippledFlags {
  static TF_PARTIAL_PAYMENT = 1 << 17

  // https://xrpl.org/accountroot.html#accountroot-flags
  static ISF_DEPOSIT_AUTH = 1 << 24
  /**
   * Check if the given flag is set in the given set of bit-flags.
   *
   * @param flag: The flag to check the presence of.
   * @param flags: The flags to check
   */
  static checkFlag(flag: number, flags: number): boolean {
    return (flag & flags) === flag
  }
}

export default RippledFlags
