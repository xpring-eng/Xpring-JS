import { EscrowCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { XRPCurrencyAmount } from '.'

/*
 * Represents an EscrowCreate transaction on the XRP Ledger.
 * An EscrowCreate transaction sequesters XRP until the escrow process either finishes or is canceled.
 *
 * @see: https://xrpl.org/escrowcreate.html
 */
export default class XRPEscrowCreate {
  /**
   * Constructs an XRPEscrowCreate from an EscrowCreate protocol buffer.
   *
   * @param escrowCreate an EscrowCreate (protobuf object) whose field values will be used to construct an XRPEscrowCreate
   * @return an XRPEscrowCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L178
   */
  public static from(escrowCreate: EscrowCreate): XRPEscrowCreate | undefined {
    // amount is a required field
    const amountCurrencyAmountProto = escrowCreate.getAmount()?.getValue()
    if (!amountCurrencyAmountProto) {
      return undefined
    }
    const amount = XRPCurrencyAmount.from(amountCurrencyAmountProto)
    if (!amount) {
      return undefined
    }
    // destination is a required field
    const destination = escrowCreate.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined
    }

    const cancelAfter = escrowCreate.getCancelAfter()?.getValue()
    const finishAfter = escrowCreate.getFinishAfter()?.getValue()
    const condition = escrowCreate.getCondition()?.getValue_asB64()
    const destinationTag = escrowCreate.getDestinationTag()?.getValue()

    return new XRPEscrowCreate(
      amount,
      destination,
      cancelAfter,
      finishAfter,
      condition,
      destinationTag,
    )
  }

  /**
   * @param amount Amount of XRP, in drops, to deduct from the sender's balance and escrow.
   *                Once escrowed, the XRP can either go to the Destination address (after the FinishAfter time)
   *                or returned to the sender (after the CancelAfter time).
   * @param destination Address to receive escrowed XRP.
   * @param cancelAfter (Optional) The time, in seconds since the Ripple Epoch, when this escrow expires.
   *                    This value is immutable; the funds can only be returned the sender after this time.
   * @param finishAfter (Optional) The time, in seconds since the Ripple Epoch, when the escrowed XRP can be released to the recipient.
   *                    This value is immutable; the funds cannot move until this time is reached.
   * @param condition (Optional) Hex value representing a PREIMAGE-SHA-256 crypto-condition.
   *                   The funds can only be delivered to the recipient if this condition is fulfilled.
   * @param destinationTag (Optional) Arbitrary tag to further specify the destination for this escrowed payment,
   *                        such as a hosted recipient at the destination address.
   */
  private constructor(
    readonly amount?: XRPCurrencyAmount,
    readonly destination?: string,
    readonly cancelAfter?: number,
    readonly finishAfter?: number,
    readonly condition?: string,
    readonly destinationTag?: number,
  ) {}
}
