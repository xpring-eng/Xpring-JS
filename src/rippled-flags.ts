/**
 * Flags used in ripppled transactions.
 *
 * @note These are only flags which are utilized in Xpring SDK. For a complete list of flags, see: https://xrpl.org/transaction-common-fields.html#flags-field.
 *
 */
enum RippledFlags {
  tfPartialPayment = 131072,
}

/**
 * Check if the given flag is present in the given flags.
 *
 * @param flag: The flag to check the presence of.
 * @param flags: The flags to check
 */
export function checkFlag(flag: RippledFlags, flags: number): boolean {
  // eslint-disable-next-line no-bitwise
  return (flag & flags) === flag
}

export default RippledFlags
