import { EscrowCancel } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an EscrowCancel transaction on the XRP Ledger.
 * Return escrowed XRP to the sender.
 *
 * @see: https://xrpl.org/escrowcancel.html
 */
export default class XRPEscrowCancel {
  /**
   * Constructs an XRPEscrowCancel from an EscrowCancel protocol buffer.
   *
   * @param escrowCancel an EscrowCancel (protobuf object) whose field values will be used to construct an XRPEscrowCancel
   * @return an XRPEscrowCancel with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L170
   */
  public static from(escrowCancel: EscrowCancel): XRPEscrowCancel | undefined {
    const owner = escrowCancel.getOwner()?.getValue()?.getAddress()
    const offerSequence = escrowCancel.getOfferSequence()?.getValue()

    // owner and offerSequence are both required fields.
    if (!owner || !offerSequence) {
      return undefined
    }
    return new XRPEscrowCancel(owner, offerSequence)
  }

  /**
   *
   * @param owner Address of the source account that funded the escrow payment.
   * @param offerSequence Transaction sequence of EscrowCreate transaction that created the escrow to cancel.
   */
  private constructor(
    readonly owner?: string,
    readonly offerSequence?: number,
  ) {}
}
