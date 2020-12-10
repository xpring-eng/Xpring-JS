import { XrpError, XrpErrorType } from '..'
import { XrplNetwork } from 'xpring-common-js'
import XrpUtils from '../shared/xrp-utils'
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
  public static from(payment: Payment, xrplNetwork: XrplNetwork): XrpPayment {
    const paymentAmountValue = payment.getAmount()?.getValue()
    if (paymentAmountValue === undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Payment protobuf is missing required `amount` field.',
      )
    }
    const amount = XrpCurrencyAmount.from(paymentAmountValue)
    // For non-XRP amounts, the nested field names in `amount` are lower-case.

    const destination = payment.getDestination()?.getValue()?.getAddress()
    if (destination === undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Payment protobuf is missing required `destination` field.',
      )
    }

    const destinationTag = payment.getDestinationTag()?.getValue()

    const destinationXAddress = XrpUtils.encodeXAddress(
      destination,
      destinationTag,
      xrplNetwork === XrplNetwork.Test,
    )
    if (!destinationXAddress) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Payment protobuf destination cannot be encoded into an X-address.',
      )
    }

    const invoiceID = payment.getInvoiceId()?.getValue_asU8()

    const paths =
      payment.getPathsList()?.length > 0
        ? payment.getPathsList().map((path) => XrpPath.from(path))
        : undefined
    if (paths !== undefined && amount.drops !== undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Payment protobuf `paths` field should be omitted for XRP-to-XRP interactions.',
      )
    }

    const paymentSendMaxValue = payment.getSendMax()?.getValue()
    const sendMax =
      paymentSendMaxValue && XrpCurrencyAmount.from(paymentSendMaxValue)
    if (sendMax !== undefined && amount.drops !== undefined) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Payment protobuf `sendMax` field should be omitted for XRP-to-XRP interactions.',
      )
    }

    const paymentDeliverMinValue = payment.getDeliverMin()?.getValue()
    const deliverMin =
      paymentDeliverMinValue && XrpCurrencyAmount.from(paymentDeliverMinValue)
    // For non-XRP amounts, the nested field names in `deliverMin` are lower-case.

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
    readonly amount: XrpCurrencyAmount,
    readonly destinationXAddress: string,
    readonly deliverMin?: XrpCurrencyAmount,
    readonly invoiceID?: Uint8Array,
    readonly paths?: Array<XrpPath | undefined>,
    readonly sendMax?: XrpCurrencyAmount,
  ) {}
}
