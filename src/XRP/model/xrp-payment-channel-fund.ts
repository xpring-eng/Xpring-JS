import { XrpError, XrpErrorType } from '..'
import { PaymentChannelFund } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'

/*
 * Represents a PaymentChannelFund transaction on the XRP Ledger.
 *
 * A PaymentChannelFund transaction adds additional XRP to an open payment channel, updates the expiration
 * time of the channel, or both. Only the source address of the channel can use this transaction.
 * (Transactions from other addresses fail with the error tecNO_PERMISSION.)
 *
 * @see: https://xrpl.org/paymentchannelfund.html
 */
export default class XrpPaymentChannelFund {
  /**
   * Constructs an XrpPaymentChannelFund from a PaymentChannelFund protocol buffer.
   *
   * @param paymentChannelFund a PaymentChannelFund (protobuf object) whose field values will be used to construct an XrpPaymentChannelFund
   * @return an XrpPaymentChannelFund with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L288
   */
  public static from(
    paymentChannelFund: PaymentChannelFund,
  ): XrpPaymentChannelFund {
    const channel = paymentChannelFund.getChannel()?.getValue_asB64()
    if (!channel) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelFund protobuf does not contain `channel` field.',
      )
    }

    const amountCurrencyAmount = paymentChannelFund.getAmount()?.getValue()
    if (!amountCurrencyAmount) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelFund protobuf does not contain `amount` field.',
      )
    }
    const amount = XrpCurrencyAmount.from(amountCurrencyAmount)

    const expiration = paymentChannelFund.getExpiration()?.getValue()

    return new XrpPaymentChannelFund(channel, amount, expiration)
  }

  /**
   *
   * @param channel The unique ID of the channel to fund, as a 64-character hexadecimal string.
   * @param amount Amount of XRP, in drops to add to the channel. To set the expiration for a channel without
   *               adding more XRP, set this to "0".
   * @param expiration (Optional) New Expiration time to set for the channel, in seconds since the Ripple Epoch.
   *                    This must be later than either the current time plus the SettleDelay of the channel,
   *                    or the existing Expiration of the channel. After the Expiration time, any transaction
   *                    that would access the channel closes the channel without taking its normal action.
   *                    Any unspent XRP is returned to the source address when the channel closes.
   *                    (Expiration is separate from the channel's immutable CancelAfter time.)
   *                    For more information, see the PayChannel ledger object type: https://xrpl.org/paychannel.html
   */
  private constructor(
    readonly channel: string,
    readonly amount: XrpCurrencyAmount,
    readonly expiration?: number,
  ) {}
}
