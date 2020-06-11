import { TrustSet } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrencyAmount from './xrp-currency-amount'

/*
 * Represents a TrustSet transaction on the XRP Ledger.
 *
 * A TrustSet transaction creates or modifies a trust line linking two accounts.
 *
 * @see: https://xrpl.org/trustset.html
 */
export default class XrpTrustSet {
  /**
   * Constructs an XrpTrustSet from a TrustSet protocol buffer.
   *
   * @param trustSet a TrustSet (protobuf object) whose field values will be used to construct an XrpTrustSet
   * @return an XrpTrustSet with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/3d86b49dae8173344b39deb75e53170a9b6c5284/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L312
   */
  public static from(trustSet: TrustSet): XrpTrustSet | undefined {
    const limitAmountCurrencyAmount = trustSet.getLimitAmount()?.getValue()
    if (!limitAmountCurrencyAmount) {
      return undefined
    }
    const limitAmount = XRPCurrencyAmount.from(limitAmountCurrencyAmount)
    if (!limitAmount) {
      return undefined
    }
    const qualityIn = trustSet.getQualityIn()?.getValue()
    const qualityOut = trustSet.getQualityOut()?.getValue()
    return new XrpTrustSet(limitAmount, qualityIn, qualityOut)
  }

  /**
   * @param limitAmount Object defining the trust line to create or modify, in the format of an XRPCurrencyAmount.
   *                    limitAmount.currency: The currency this trust line applies to, as a three-letter ISO 4217 Currency Code,
   *                                           or a 160-bit hex value according to currency format. "XRP" is invalid.
   *                    limitAmount.value: Quoted decimal representation of the limit to set on this trust line.
   *                    limitAmount.issuer: The address of the account to extend trust to.
   * @param qualityIn (Optional) Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                   A value of 0 is shorthand for treating balances at face value.
   * @param qualityOut (Optional) Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units.
   *                    A value of 0 is shorthand for treating balances at face value.
   */
  private constructor(
    readonly limitAmount: XRPCurrencyAmount,
    readonly qualityIn?: number,
    readonly qualityOut?: number,
  ) {}
}
