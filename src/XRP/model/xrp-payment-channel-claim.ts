import { PaymentChannelClaim } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import { XRPCurrencyAmount } from '.'

/*
 * Represents a PaymentChannelClaim transaction on the XRP Ledger.
 *
 * A PaymentChannelClaim transaction claims XRP from a payment channel, adjusts the payment channel's expiration, or both.
 *
 * @see: https://xrpl.org/paymentchannelclaim.html
 */
export default class XrpPaymentChannelClaim {
  /**
   * Constructs an XrpPaymentChannelClaim from a PaymentChannelClaim protocol buffer.
   *
   * @param paymentChannelClaim a PaymentChannelClaim (protobuf object) whose field values will be used to construct an XrpPaymentChannelClaim
   * @return an XrpPaymentChannelClaim with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L258
   */
  public static from(
    paymentChannelClaim: PaymentChannelClaim,
  ): XrpPaymentChannelClaim | undefined {
    const channel = paymentChannelClaim.getChannel()?.getValue_asB64()
    // channel is a required field
    if (!channel) {
      return undefined
    }

    const balanceCurrencyAmount = paymentChannelClaim.getBalance()?.getValue()
    let balance
    if (balanceCurrencyAmount) {
      balance = XRPCurrencyAmount.from(balanceCurrencyAmount)
    }

    const amountCurrencyAmount = paymentChannelClaim.getAmount()?.getValue()
    let amount
    if (amountCurrencyAmount) {
      amount = XRPCurrencyAmount.from(amountCurrencyAmount)
    }

    const signature = paymentChannelClaim
      .getPaymentChannelSignature()
      ?.getValue_asB64()

    const publicKey = paymentChannelClaim.getPublicKey()?.getValue_asB64()

    return new XrpPaymentChannelClaim(
      channel,
      balance,
      amount,
      signature,
      publicKey,
    )
  }

  /**
   * @param channel The unique ID of the channel, as a 64-character hexadecimal string.
   * @param balance (Optional) Total amount of XRP, in drops, delivered by this channel after processing this claim.
   *                Required to deliver XRP. Must be more than the total amount delivered by the channel so far,
   *                but not greater than the Amount of the signed claim. Must be provided except when closing the channel.
   * @param amount (Optional) The amount of XRP, in drops, authorized by the Signature.
   *                This must match the amount in the signed message.
   *                This is the cumulative amount of XRP that can be dispensed by the channel, including XRP previously redeemed.
   * @param signature (Optional) The signature of this claim, as hexadecimal. The signed message contains the channel ID and the
   *                  amount of the claim. Required unless the sender of the transaction is the source address of the channel.
   * @param publicKey (Optional) The public key used for the signature, as hexadecimal. This must match the PublicKey stored
   *                  in the ledger for the channel. Required unless the sender of the transaction is the source address of
   *                  the channel and the Signature field is omitted. (The transaction includes the PubKey so that rippled
   *                  can check the validity of the signature before trying to apply the transaction to the ledger.)
   */
  private constructor(
    readonly channel: string,
    readonly balance?: XRPCurrencyAmount,
    readonly amount?: XRPCurrencyAmount,
    readonly signature?: string,
    readonly publicKey?: string,
  ) {}
}
