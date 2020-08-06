import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../xrp-utils'
import { Payment } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'
import XrpPath from './xrp-path'

/**
 * Represents a payment on the XRP Ledger.
 * @see: https://xrpl.org/payment.html
 */
export default class XrpPayment {
  /**
   * Constructs an XrpPayment from a Payment.
   *
   * @param payment a Payment (protobuf object) whose field values will be used
   *                to construct an XrpPayment
   * @param xrplNetwork The Xrpl network from which this object was retrieved.
   * @return an XrpPayment with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L224
   */
  public static from(
    payment: Payment,
    xrplNetwork: XrplNetwork,
  ): XrpPayment | undefined {
    const paymentAmountValue = payment.getAmount()?.getValue()
    const amount =
      paymentAmountValue && XrpCurrencyAmount.from(paymentAmountValue)
    if (!amount) {
      return undefined // amount is required
    }

    const destination = payment.getDestination()?.getValue()?.getAddress()
    if (!destination) {
      return undefined // destination is required
    }

    const destinationTag = payment.getDestinationTag()?.getValue()

    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork === XrplNetwork.Test,
    )
    // An X-address should always be able to be encoded.
    if (!destinationXAddress) {
      return undefined
    }

    // If the deliverMin field is set, it must be able to be transformed into a XrpCurrencyAmount.
    const paymentDeliverMinValue = payment.getDeliverMin()?.getValue()
    const deliverMin =
      paymentDeliverMinValue && XrpCurrencyAmount.from(paymentDeliverMinValue)
    if (paymentDeliverMinValue && !deliverMin) {
      return undefined
    }

    const invoiceID = payment.getInvoiceId()?.getValue_asU8()

    const paths =
      payment.getPathsList()?.length > 0
        ? payment.getPathsList().map((path) => XrpPath.from(path))
        : undefined

    // If the sendMax field is set, it must be able to be transformed into an XrpCurrencyAmount.
    const paymentSendMaxValue = payment.getSendMax()?.getValue()
    const sendMax =
      paymentSendMaxValue && XrpCurrencyAmount.from(paymentSendMaxValue)
    if (paymentSendMaxValue && !sendMax) {
      return undefined
    }

    return new XrpPayment(
      amount,
      destinationXAddress,
      deliverMin,
      invoiceID,
      paths,
      sendMax,
    )
  }

  /**
   * @param amount The amount of currency to deliver.
   * @param destinationXAddress The address and (optional) destination tag of the account receiving the payment, encoded in X-address format.
   *                            See https://xrpaddress.info/.
   * @param deliverMin (Optional) Minimum amount of destination currency this transaction should deliver.
   * @param invoiceID (Optional) Arbitrary 256-bit hash representing a specific reason or identifier for this payment.
   * @param paths Array of payment paths to be used for this transaction.  Must be omitted for XRP-to-XRP transactions.
   * @param sendMax (Optional) Highest amount of source currency this transaction is allowed to cost.
   */
  private constructor(
    readonly amount?: XrpCurrencyAmount,
    readonly destinationXAddress?: string,
    readonly deliverMin?: XrpCurrencyAmount,
    readonly invoiceID?: Uint8Array,
    readonly paths?: Array<XrpPath | undefined>,
    readonly sendMax?: XrpCurrencyAmount,
  ) {}
}
