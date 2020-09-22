import { XrpError, XrpErrorType } from '..'
import { CurrencyAmount } from '../Generated/web/org/xrpl/rpc/v1/amount_pb'
import XrpIssuedCurrency from './xrp-issued-currency'

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
  public static from(
    currencyAmount: CurrencyAmount,
  ): XrpCurrencyAmount | undefined {
    switch (currencyAmount.getAmountCase()) {
      // Mutually exclusive: either drops or issuedCurrency is set in an XRPCurrencyAmount
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (issuedCurrencyAmount) {
          const issuedCurrency = XrpIssuedCurrency.from(issuedCurrencyAmount)
          if (issuedCurrency) {
            return new XrpCurrencyAmount(undefined, issuedCurrency)
          }
        }
        throw new XrpError(
          XrpErrorType.MalformedProtobuf,
          'Currency amount protobuf does not have a defined amount of issued currency.',
        )
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const drops = currencyAmount.getXrpAmount()?.getDrops()
        if (drops) {
          return new XrpCurrencyAmount(drops, undefined)
        }
        throw new XrpError(
          XrpErrorType.MalformedProtobuf,
          'Currency amount protobuf does not have a defined amount of XRP.',
        )
      }
      default:
        throw new XrpError(
          XrpErrorType.MalformedProtobuf,
          'Currency amount protobuf does not have an amount set.',
        )
    }
  }

  /**
   * Note: Mutually exclusive fields - only drops XOR issuedCurrency should be set.
   *
   * @param drops An amount of XRP, specified in drops.
   * @param issuedCurrency An amount of an issued currency.
   */
  private constructor(
    readonly drops?: string,
    readonly issuedCurrency?: XrpIssuedCurrency,
  ) {}
}
