import { CheckCancel } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a CheckCancel transaction on the XRP Ledger.
 * Cancels an unredeemed Check, removing it from the ledger without sending any money.
 * The source or the destination of the check can cancel a Check at any time using this transaction type.
 * If the Check has expired, any address can cancel it.
 * @see: https://xrpl.org/checkcancel.html
 */
export default class XRPCheckCancel {
  /**
   * Constructs an XRPCheckCancel from a CheckCancel protocol buffer.
   *
   * @param checkCancel a CheckCancel (protobuf object) whose field values will be used to construct an XRPCheckCancel
   * @return an XRPCheckCancel with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L126
   */
  public static from(checkCancel: CheckCancel): XRPCheckCancel | undefined {
    const checkId = checkCancel.getCheckId()?.getValue_asB64()
    if (!checkId) {
      return undefined
    }
    return new XRPCheckCancel(checkId)
  }

  /**
   *
   * @param checkId The ID of the Check ledger object to cancel, as a 64-character hexadecimal string.
   */
  private constructor(readonly checkId?: string) {}
}
