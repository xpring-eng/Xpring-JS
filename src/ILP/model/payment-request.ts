import { BigInteger } from 'big-integer'
import { SendPaymentRequest } from '../Generated/node/send_payment_request_pb'

/**
 * A request object that can be used to send a payment request to a connector
 */
export class PaymentRequest {
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
  public constructor(options: {
    amount: BigInteger
    destinationPaymentPointer: string
    senderAccountId: string
  }) {
    this.amount = options.amount
    this.destinationPaymentPointer = options.destinationPaymentPointer
    this.senderAccountId = options.senderAccountId
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
