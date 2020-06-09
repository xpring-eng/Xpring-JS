import { EscrowFinish } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents an EscrowFinish transaction on the XRP Ledger.
 * An EscrowFinish transaction delivers XRP from a held payment to the recipient.
 *
 * @see: https://xrpl.org/escrowfinish.html
 */
export default class XRPEscrowFinish {
  /**
   * Constructs an XRPEscrowFinish from an EscrowFinish protocol buffer.
   *
   * @param escrowFinish an EscrowFinish (protobuf object) whose field values will be used to construct an XRPEscrowFinish
   * @return an XRPEscrowFinish with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L194
   */
  public static from(escrowFinish: EscrowFinish): XRPEscrowFinish | undefined {
    const owner = escrowFinish.getOwner()?.getValue()?.getAddress()
    const offerSequence = escrowFinish.getOfferSequence()?.getValue()
    // owner and offerSequence are required fields
    if (!owner || !offerSequence) {
      return undefined
    }
    const condition = escrowFinish.getCondition()?.getValue_asB64()
    const fulfillment = escrowFinish.getFulfillment()?.getValue_asB64()

    return new XRPEscrowFinish(owner, offerSequence, condition, fulfillment)
  }

  /**
   * @param owner Address of the source account that funded the held payment.
   * @param offerSequence Transaction sequence of EscrowCreate transaction that created the held payment to finish.
   * @param condition (Optional) Hex value matching the previously-supplied PREIMAGE-SHA-256 crypto-condition  of the held payment.
   * @param fulfillment (Optional) Hex value of the PREIMAGE-SHA-256 crypto-condition fulfillment  matching the held payment's Condition.
   */
  private constructor(
    readonly owner?: string,
    readonly offerSequence?: number,
    readonly condition?: string,
    readonly fulfillment?: string,
  ) {}
}