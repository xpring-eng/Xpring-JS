/**
 * Flags used in ripppled transactions.
 *
 * @note These are only flags which are utilized in Xpring SDK. For a complete list of flags, see: https://xrpl.org/transaction-common-fields.html#flags-field.
 */
class RippledFlags {
  static TF_PARTIAL_PAYMENT = 131072

  /**
   * Check if the given flag is present in the given flags.
   *
   * @param flag: The flag to check the presence of.
   * @param flags: The flags to check
   */
  static checkFlag(flag: number, flags: number): boolean {
    /* eslint-disable no-bitwise */
    return (flag & flags) === flag
  }
}

export default RippledFlags
