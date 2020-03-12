import { Payment } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrencyAmount from './xrp-currency-amount'
import XRPPath from './xrp-path'

// TODO(amiecorso): Modify this object to use X-Address format.
export default class XRPPayment {
  public static from(payment: Payment): XRPPayment | undefined {
    let amount
    const paymentAmountValue = payment.getAmount()?.getValue()
    if (paymentAmountValue) {
      amount = XRPCurrencyAmount.from(paymentAmountValue)
      if (!amount) {
        return undefined // amount is required
      }
    } else {
      return undefined
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
    let deliverMin
    if (payment.hasDeliverMin()) {
      const paymentDeliverMinValue = payment.getDeliverMin()?.getValue()
      if (paymentDeliverMinValue) {
        deliverMin = XRPCurrencyAmount.from(paymentDeliverMinValue)
        if (!deliverMin) {
          return undefined
        }
      }
    } else {
      deliverMin = undefined
    }
    const invoiceID = payment.getInvoiceId()?.getValue()
    const paths =
      payment.getPathsList()?.length > 0
        ? payment.getPathsList().map((path) => XRPPath.from(path))
        : undefined

    // If the sendMax field is set, it must be able to be transformed into a XRPCurrencyAmount.
    let sendMax
    if (payment.hasSendMax()) {
      const paymentSendMaxValue = payment.getSendMax()?.getValue()
      if (paymentSendMaxValue) {
        sendMax = XRPCurrencyAmount.from(paymentSendMaxValue)
        if (!sendMax) {
          return undefined
        }
      } else {
        sendMax = undefined
      }
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
    readonly invoiceID?: Uint8Array | string,
    readonly paths?: (XRPPath | undefined)[],
    readonly sendMax?: XRPCurrencyAmount,
  ) {}
}
