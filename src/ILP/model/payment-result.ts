import bigInt, { BigInteger } from 'big-integer'
import { SendPaymentResponse } from '../../generated/node/ilp/send_payment_response_pb'

/**
 * A response object containing details about a requested payment
 */
export class PaymentResult {
  /**
   * A BigInteger representing the original amount to be sent in a given payment.
   */
  readonly originalAmount: BigInteger

  /**
   * The actual amount, in the receivers units, that was delivered to the receiver. Any currency conversion and/or
   * connector fees may cause this to be different than the amount sent.
   */
  readonly amountDelivered: BigInteger

  /**
   * The actual amount, in the senders units, that was sent to the receiver. In the case of a timeout or rejected
   * packets this amount may be less than the requested amount to be sent.
   */
  readonly amountSent: BigInteger

  /**
   * Indicates if the payment was completed successfully.
   * true if payment was successful
   */
  readonly successfulPayment: boolean

  /**
   * Initializes a new PaymentResult
   */
  constructor(options: {
    originalAmount: BigInteger
    amountDelivered: BigInteger
    amountSent: BigInteger
    successfulPayment: boolean
  }) {
    this.originalAmount = options.originalAmount
    this.amountDelivered = options.amountDelivered
    this.amountSent = options.amountSent
    this.successfulPayment = options.successfulPayment
  }

  /**
   * Constructs a PaymentResult from a protobuf SendPaymentResponse
   *
   * @param protoResponse a SendPaymentResponse to be converted
   * @return a PaymentResult with fields populated using the analogous fields in the proto object
   */
  public static from(protoResponse: SendPaymentResponse): PaymentResult {
    return new PaymentResult({
      originalAmount: bigInt(protoResponse.getOriginalAmount()),
      amountDelivered: bigInt(protoResponse.getAmountDelivered()),
      amountSent: bigInt(protoResponse.getAmountSent()),
      successfulPayment: protoResponse.getSuccessfulPayment(),
    })
  }
}

export default PaymentResult
