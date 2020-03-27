import { Payment } from './Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrencyAmount from './xrp-currency-amount'
import XRPPath from './xrp-path'

// TODO(amiecorso): Modify this object to use X-Address format.
/*
 * Represents a payment on the XRP Ledger.
 * @see: https://xrpl.org/payment.html
 */
export default class XRPPayment {
  public static from(payment: Payment): XRPPayment | undefined {
    const paymentAmountValue = payment.getAmount()?.getValue()
    const amount =
      paymentAmountValue && XRPCurrencyAmount.from(paymentAmountValue)
    if (!amount) {
      return undefined // amount is required
    }

    const destination = payment
      .getDestination()
      ?.getValue()
      ?.getAddress()
    if (!destination) {
      return undefined // destination is required
    }

    const destinationTag = payment.getDestinationTag()?.getValue()

    // If the deliverMin field is set, it must be able to be transformed into a XRPCurrencyAmount.
    const paymentDeliverMinValue = payment.getDeliverMin()?.getValue()
    const deliverMin =
      paymentDeliverMinValue && XRPCurrencyAmount.from(paymentDeliverMinValue)
    if (paymentDeliverMinValue && !deliverMin) {
      return undefined
    }

    const invoiceID = payment.getInvoiceId()?.getValue_asU8()

    const paths =
      payment.getPathsList()?.length > 0
        ? payment.getPathsList().map((path) => XRPPath.from(path))
        : undefined

    // If the sendMax field is set, it must be able to be transformed into an XRPCurrencyAmount.
    const paymentSendMaxValue = payment.getSendMax()?.getValue()
    const sendMax =
      paymentSendMaxValue && XRPCurrencyAmount.from(paymentSendMaxValue)
    if (paymentSendMaxValue && !sendMax) {
      return undefined
    }

    return new XRPPayment(
      amount,
      destination,
      destinationTag,
      deliverMin,
      invoiceID,
      paths,
      sendMax,
    )
  }

  private constructor(
    readonly amount?: XRPCurrencyAmount,
    readonly destination?: string,
    readonly destinationTag?: number,
    readonly deliverMin?: XRPCurrencyAmount,
    readonly invoiceID?: Uint8Array,
    readonly paths?: Array<XRPPath | undefined>,
    readonly sendMax?: XRPCurrencyAmount,
  ) {}
}
