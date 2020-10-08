/* eslint-disable no-bitwise */

/**
 * There are several options which can be either enabled or disabled for an XRPL account.
 * These options can be changed with an AccountSet transaction. In the ledger,
 * flags are represented as binary values that can be combined with bitwise-or operations.
 * The bit values for the flags in the ledger are different than the values used to enable
 * or disable those flags in a transaction. Ledger flags have names that begin with lsf.
 *
 * @see https://xrpl.org/accountroot.html#accountroot-flags
 */
class AccountRootFlags {
  static LSF_DEPOSIT_AUTH = 1 << 24
  static LSF_REQUIRE_AUTH = 1 << 18
  static NO_FLAGS = 0

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

export default AccountRootFlags
