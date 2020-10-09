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
  static LSF_DEPOSIT_AUTH = 1 << 24 // 0x01000000, 16777216
  static LSF_DEFAULT_RIPPLE = 1 << 23 // 0x00800000, 8388608
  static LSF_GLOBAL_FREEZE = 1 << 22 // 0x00400000, 4194304
  static LSF_NO_FREEZE = 1 << 21 // 0x00200000, 2097152
  static LSF_DISABLE_MASTER = 1 << 20 // 0x00100000, 1048576
  static LSF_DISALLOW_XRP = 1 << 19 // 0x00080000, 524288
  static LSF_REQUIRE_AUTH = 1 << 18 // 0x00040000, 262144
  static LSF_REQUIRE_DEST_TAG = 1 << 17 // 0x00020000, 131072
  static LSF_PASSWORD_SPENT = 1 << 16 // 0x00010000, 65536
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
