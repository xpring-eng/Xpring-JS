import { PaymentChannelClaim } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'

/*
 * Represents a PaymentChannelCreate transaction on the XRP Ledger.

 * Create a unidirectional channel and fund it with XRP. The address sending this transaction becomes
 * the "source address" of the payment channel.
 *
 * @see: https://xrpl.org/paymentchannelcreate.html
 */
export default class XRPPaymentChannelCreate {
  /**
   * Constructs an XRPPaymentChannelCreate from a PaymentChannelCreate protocol buffer.
   *
   * @param paymentChannelCreate a PaymentChannelCreate (protobuf object) whose field values will be used to construct an XRPPaymentChannelCreate
   * @return an XRPPaymentChannelCreate with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L272
   */
  public static from(
    paymentChannelCreate: PaymentChannelCreate,
  ): XRPPaymentChannelCreate | undefined {
    return new XRPPaymentChannelCreate()
  }

  private constructor() {}
}
