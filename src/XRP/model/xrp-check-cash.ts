import { XrpError, XrpErrorType } from '..'
import { CheckCash } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrencyAmount from './xrp-currency-amount'

/*
 * Represents a CheckCash transaction on the XRP Ledger.
 *
 * A CheckCash transaction attempts to redeem a Check object in the ledger to receive up to the amount
 * authorized by the corresponding CheckCreate transaction.
 *
 * @see: https://xrpl.org/checkcash.html
 */
export default class XrpCheckCash {
  /**
   * Constructs an XrpCheckCash from a CheckCash protocol buffer.
   *
   * @param checkCash a CheckCash (protobuf object) whose field values will be used to construct an XrpCheckCash
   * @return an XrpCheckCash with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L132
   */
  public static from(checkCash: CheckCash): XrpCheckCash {
    const checkId = checkCash.getCheckId()?.getValue_asB64()
    if (!checkId) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'CheckCash protobuf is missing `checkID` field.',
      )
    }

    const amountCurrencyAmount = checkCash.getAmount()?.getValue()
    const amount = amountCurrencyAmount
      ? XrpCurrencyAmount.from(amountCurrencyAmount)
      : undefined

    const deliverMinCurrencyAmount = checkCash.getDeliverMin()?.getValue()
    const deliverMin = deliverMinCurrencyAmount
      ? XrpCurrencyAmount.from(deliverMinCurrencyAmount)
      : undefined

    if (deliverMin && amount) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'CheckCash protobuf is contains both `amount` and `deliverMin` fields.',
      )
    }
    if (!deliverMin && !amount) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'CheckCash protobuf is contains neither `amount` nor `deliverMin` fields.',
      )
    }

    return new XrpCheckCash(checkId, amount, deliverMin)
  }

  /**
   * @param checkId The ID of the Check ledger object to cash, as a 64-character hexadecimal string.
   * @param amount (Optional) Redeem the Check for exactly this amount, if possible.
   *                The currency must match that of the SendMax of the corresponding CheckCreate transaction.
   *                You must provide either this field or deliverMin.
   * @param deliverMin (Optional) Redeem the Check for at least this amount and for as much as possible.
   *                    The currency must match that of the SendMax of the corresponding CheckCreate transaction.
   *                    You must provide either this field or amount.
   */
  private constructor(
    readonly checkId: string,
    readonly amount?: XrpCurrencyAmount,
    readonly deliverMin?: XrpCurrencyAmount,
  ) {}
}
