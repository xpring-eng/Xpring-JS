import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../xrp-utils'
import { PaymentChannelCreate } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'

/*
 * Represents a PaymentChannelCreate transaction on the XRP Ledger.
 *
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
    xrplNetwork: XrplNetwork,
  ): XrpPaymentChannelCreate {
    const amountCurrencyAmount = paymentChannelCreate.getAmount()?.getValue()
    if (amountCurrencyAmount === undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelCreate protobuf does not contain `amount` field.',
      )
    }
    const amount = XrpCurrencyAmount.from(amountCurrencyAmount)
    const destination = paymentChannelCreate
      .getDestination()
      ?.getValue()
      ?.getAddress()
    if (!destination) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelCreate protobuf does not contain `destination` field.',
      )
    }
    const destinationTag = paymentChannelCreate.getDestinationTag()?.getValue()

    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork == XrplNetwork.Test || xrplNetwork == XrplNetwork.Dev,
    )
    if (!destinationXAddress) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Cannot construct XAddress from PaymentChannelCreate protobuf `destination` and `destinationTag` fields.',
      )
    }

    const settleDelay = paymentChannelCreate.getSettleDelay()?.getValue()
    if (settleDelay === undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelCreate protobuf does not contain `settleDelay` field.',
      )
    }
    const publicKey = paymentChannelCreate.getPublicKey()?.getValue_asB64()
    if (!publicKey) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'PaymentChannelCreate protobuf does not contain `publicKey` field.',
      )
    }

    const cancelAfter = paymentChannelCreate.getCancelAfter()?.getValue()

    return new XrpPaymentChannelCreate(
      amount,
      destinationXAddress,
      settleDelay,
      publicKey,
      cancelAfter,
    )
  }

  /**
   * @param amount Amount of XRP, in drops, to deduct from the sender's balance and set aside in this channel.
   *                While the channel is open, the XRP can only go to the Destination address.
   *                When the channel closes, any unclaimed XRP is returned to the source address's balance.
   * @param destinationXAddress Address and (optional) destination tag to receive XRP claims against this channel,
   *                            encoded as an X-address (see https://xrpaddress.info/).
   *                            This is also known as the "destination address" for the channel.
   *                            Cannot be the same as the sender (Account).
   * @param settleDelay Amount of time the source address must wait before closing the channel if it has unclaimed XRP.
   * @param publicKey The public key of the key pair the source will use to sign claims against this channel, in hexadecimal.
   *                  This can be any secp256k1 or Ed25519 public key.
   * @param cancelAfter (Optional) The time, in seconds since the Ripple Epoch, when this channel expires.
   *                    Any transaction that would modify the channel after this time closes the channel without otherwise affecting it.
   *                    This value is immutable; the channel can be closed earlier than this time but cannot remain open after this time.)
   */
  private constructor(
    readonly amount: XrpCurrencyAmount,
    readonly destinationXAddress: string,
    readonly settleDelay: number,
    readonly publicKey: string,
    readonly cancelAfter?: number,
  ) {}
}
