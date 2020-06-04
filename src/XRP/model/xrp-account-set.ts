import { AccountSet } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an AccountSet transaction on the XRP Ledger.
 * An AccountSet transaction modifies the properties of an account in the XRP Ledger.
 *
 * @see: https://xrpl.org/accountset.html
 */
export default class XRPAccountSet {
  /**
   * Constructs an XRPAccountSet from an AccountSet.
   *
   * @param accountSet an AccountSet (protobuf object) whose field values will be used
   *                to construct an XRPAccountSet
   * @return an XRPAccountSet with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L100
   */
  public static from(accountSet: AccountSet): XRPAccountSet | undefined {
    const clearFlag = accountSet.getClearFlag()?.getValue()
    const domain = accountSet.getDomain()?.getValue()
    const emailHash = accountSet.getEmailHash()?.getValue_asU8()
    const messageKey = accountSet.getMessageKey()?.getValue_asU8()
    const setFlag = accountSet.getSetFlag()?.getValue()
    const transferRate = accountSet.getTransferRate()?.getValue()
    const tickSize = accountSet.getTickSize()?.getValue()

    return new XRPAccountSet(
      clearFlag,
      domain,
      emailHash,
      messageKey,
      setFlag,
      transferRate,
      tickSize,
    )
  }

  /**
   * @param clearFlag (Optional) Unique identifier of a flag to disable for this account.
   * @param domain (Optional) The domain that owns this account, as a string of hex representing the ASCII for the domain in lowercase.
   * @param emailHash (Optional) Hash of an email address to be used for generating an avatar image.
   * @param messageKey (Optional) Public key for sending encrypted messages to this account.
   * @param setFlag (Optional) Integer flag to enable for this account.
   * @param transferRate (Optional) The fee to charge when users transfer this account's issued currencies, represented as billionths of a unit.
   *                     Cannot be more than 2000000000 or less than 1000000000, except for the special case 0 meaning no fee.
   * @param tickSize (Optional) Tick size to use for offers involving a currency issued by this address.
   *                  The exchange rates of those offers is rounded to this many significant digits.
   *                  Valid values are 3 to 15 inclusive, or 0 to disable. (Requires the TickSize amendment.)
   */
  private constructor(
    readonly clearFlag?: number,
    readonly domain?: string,
    readonly emailHash?: Uint8Array,
    readonly messageKey?: Uint8Array,
    readonly setFlag?: number,
    readonly transferRate?: number,
    readonly tickSize?: number,
  ) {}
}
