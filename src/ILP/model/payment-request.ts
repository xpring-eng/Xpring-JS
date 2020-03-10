import { BigInteger } from 'big-integer'
import { SendPaymentRequest } from '../../generated/node/ilp/send_payment_request_pb'

/**
 * A request object htat can be used to send a payment request to a connector
 */
class PaymentRequest {
  /**
   * The amount to send.  This amount is denominated in the asset code and asset scale of the sender's account
   * on the connector.  For example, if the account has an asset code of "USD" and an asset scale of 9,
   * a payment request of 100 units would send 100 nano-dollars.
   */
  readonly amount: BigInteger

  /**
   * A payment pointer is a standardized identifier for payment accounts.
   * This payment pointer will be the identifier for the account of the recipient of this payment on the ILP
   * network.
   *
   * @see "https://github.com/interledger/rfcs/blob/master/0026-payment-pointers/0026-payment-pointers.md"
   */
  readonly destinationPaymentPointer: string

  /**
   * @return The accountID of the sender.
   */
  readonly senderAccountId: string

  /**
   * Initialize a new instance of PaymentRequest
   */
  public constructor(
    amount: BigInteger,
    destinationPaymentPointer: string,
    senderAccountId: string,
  ) {
    this.amount = amount
    this.destinationPaymentPointer = destinationPaymentPointer
    this.senderAccountId = senderAccountId
  }

  /**
   * Constructs a PaymentRequest (non-proto) from this SendPaymentRequest
   *
   * @return A SendPaymentRequest populated with the analogous fields in
   *          a PaymentRequest
   */
  public toProto(): SendPaymentRequest {
    const protoRequest: SendPaymentRequest = new SendPaymentRequest()
    protoRequest.setAmount(this.amount.toJSNumber())
    protoRequest.setDestinationPaymentPointer(this.destinationPaymentPointer)
    protoRequest.setAccountId(this.senderAccountId)
    return protoRequest
  }
}

export default PaymentRequest
