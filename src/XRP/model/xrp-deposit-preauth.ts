import { DepositPreauth } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a DepositPreauth transaction on the XRP Ledger.

 * A DepositPreauth transaction gives another account pre-approval to deliver payments to the sender of this transaction.
 * This is only useful if the sender of this transaction is using (or plans to use) Deposit Authorization.
 *
 * @see: https://xrpl.org/depositpreauth.html
 */
export default class XRPDepositPreauth {
  /**
   * Constructs an XRPDepositPreauth from a DepositPreauth protocol buffer.
   *
   * @param depositPreauth a DepositPreauth (protobuf object) whose field values will be used to construct an XRPDepositPreauth
   * @return an XRPDepositPreauth with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L159
   */
  public static from(
    depositPreauth: DepositPreauth,
  ): XRPDepositPreauth | undefined {
    const authorize = depositPreauth.getAuthorize()?.getValue()?.getAddress()
    const unauthorize = depositPreauth
      .getUnauthorize()
      ?.getValue()
      ?.getAddress()
    return new XRPDepositPreauth(authorize, unauthorize)
  }

  /**
   * Note: authorize and unauthorize are mutually exclusive fields: one but not both should be set.
   * @param authorize (Optional) The XRP Ledger address of the sender to preauthorize.
   * @param unauthorize (Optional) The XRP Ledger address of a sender whose preauthorization should be revoked.
   */
  private constructor(
    readonly authorize?: string,
    readonly unauthorize?: string,
  ) {}
}
