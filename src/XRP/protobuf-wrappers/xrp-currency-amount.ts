import { XrpError, XrpErrorType } from '..'
import { CurrencyAmount } from '../Generated/web/org/xrpl/rpc/v1/amount_pb'
import XrplIssuedCurrency from './xrpl-issued-currency'

/**
 * An amount of currency on the XRP Ledger
 * @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XrpCurrencyAmount {
  /**
   * Constructs an XrpCurrencyAmount from a CurrencyAmount.
   *
   * @param currencyAmount a CurrencyAmount (protobuf object) whose field values will be used
   *                       to construct an XrpCurrencyAmount
   * @returns an XrpCurrencyAmount with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/amount.proto#L10
   */
  public static from(currencyAmount: CurrencyAmount): XrpCurrencyAmount {
    // Mutually exclusive: either drops or issuedCurrency is set in an XRPCurrencyAmount
    const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
    const xrpAmount = currencyAmount.getXrpAmount()
    if (issuedCurrencyAmount !== undefined && xrpAmount === undefined) {
      const issuedCurrency = XrplIssuedCurrency.from(issuedCurrencyAmount)
      return new XrpCurrencyAmount(undefined, issuedCurrency)
    }
    if (xrpAmount !== undefined && issuedCurrencyAmount === undefined) {
      const drops = xrpAmount.getDrops()
      return new XrpCurrencyAmount(drops, undefined)
    }

    throw new XrpError(
      XrpErrorType.MalformedProtobuf,
      'CurrencyAmount protobuf does not have an amount set.',
    )
  }

  /**
   * Note: Mutually exclusive fields - only drops XOR issuedCurrency should be set.
   *
   * @param drops An amount of XRP, specified in drops.
   * @param issuedCurrency An amount of an issued currency.
   */
  private constructor(
    readonly drops?: string,
    readonly issuedCurrency?: XrplIssuedCurrency,
  ) {}
}
