import { PaymentChannelCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { XRPCurrencyAmount } from '.'

/*
 * Represents a PaymentChannelCreate transaction on the XRP Ledger.

 * A PaymentChannelCreate transaction creates a unidirectional channel and funds it with XRP.
 * The address sending this transaction becomes the "source address" of the payment channel.
 *
 * @see: https://xrpl.org/paymentchannelcreate.html
 */
export default class XrpPaymentChannelCreate {
  /**
   * Constructs an XrpPaymentChannelCreate from a PaymentChannelCreate protocol buffer.
   *
   * @param paymentChannelCreate a PaymentChannelCreate (protobuf object) whose field values will be used to construct an XrpPaymentChannelCreate
   * @return an XrpPaymentChannelCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L272
   */
  public static from(
    paymentChannelCreate: PaymentChannelCreate,
  ): XrpPaymentChannelCreate | undefined {
    const amountCurrencyAmount = paymentChannelCreate.getAmount()?.getValue()
    if (!amountCurrencyAmount) {
      return undefined
    }
    const amount = XRPCurrencyAmount.from(amountCurrencyAmount)
    const destination = paymentChannelCreate
      .getDestination()
      ?.getValue()
      ?.getAddress()
    const settleDelay = paymentChannelCreate.getSettleDelay()?.getValue()
    const publicKey = paymentChannelCreate.getPublicKey()?.getValue_asB64()

    // required fields
    if (!amount || !destination || !settleDelay || !publicKey) {
      return undefined
    }

    const cancelAfter = paymentChannelCreate.getCancelAfter()?.getValue()
    const destinationTag = paymentChannelCreate.getDestinationTag()?.getValue()

    return new XrpPaymentChannelCreate(
      amount,
      destination,
      settleDelay,
      publicKey,
      cancelAfter,
      destinationTag,
    )
  }

  /**
   * @param amount Amount of XRP, in drops, to deduct from the sender's balance and set aside in this channel.
   *                While the channel is open, the XRP can only go to the Destination address.
   *                When the channel closes, any unclaimed XRP is returned to the source address's balance.
   * @param destination Address to receive XRP claims against this channel.
   *                    This is also known as the "destination address" for the channel.
   *                    Cannot be the same as the sender (Account).
   * @param settleDelay Amount of time the source address must wait before closing the channel if it has unclaimed XRP.
   * @param publicKey The public key of the key pair the source will use to sign claims against this channel, in hexadecimal.
   *                  This can be any secp256k1 or Ed25519 public key.
   * @param cancelAfter (Optional) The time, in seconds since the Ripple Epoch, when this channel expires.
   *                    Any transaction that would modify the channel after this time closes the channel without otherwise affecting it.
   *                    This value is immutable; the channel can be closed earlier than this time but cannot remain open after this time.)
   * @param destinationTag (Optional) Arbitrary tag to further specify the destination for this payment channel,
   *                        such as a hosted recipient at the destination address.
   */
  private constructor(
    readonly amount: XRPCurrencyAmount,
    readonly destination: string,
    readonly settleDelay: number,
    readonly publicKey: string,
    readonly cancelAfter?: number,
    readonly destinationTag?: number,
  ) {}
}
