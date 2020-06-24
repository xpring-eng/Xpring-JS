import { SetRegularKey } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a SetRegularKey transaction on the XRP Ledger.
 *
 * A SetRegularKey transaction assigns, changes, or removes the regular key pair associated with an account.
 * You can protect your account by assigning a regular key pair to it and using it instead of the master key
 * pair to sign transactions whenever possible. If your regular key pair is compromised, but your master key
 * pair is not, you can use a SetRegularKey transaction to regain control of your account.
 *
 * @see: https://xrpl.org/setregularkey.html
 */
export default class XrpSetRegularKey {
  /**
   * Constructs an XrpSetRegularKey from a SetRegularKey protocol buffer.
   *
   * @param setRegularKey a SetRegularKey (protobuf object) whose field values will be used to construct an XrpSetRegularKey
   * @return an XrpSetRegularKey with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L298
   */
  public static from(
    setRegularKey: SetRegularKey,
  ): XrpSetRegularKey | undefined {
    const regularKey = setRegularKey.getRegularKey()?.getValue()?.getAddress()
    return new XrpSetRegularKey(regularKey)
  }

  /**
   * @param regularKey (Optional) A base-58-encoded Address that indicates the regular key pair to be assigned to the account.
   *                    If omitted, removes any existing regular key pair from the account.
   *                    Must not match the master key pair for the address.
   */
  private constructor(readonly regularKey?: string) {}
}
