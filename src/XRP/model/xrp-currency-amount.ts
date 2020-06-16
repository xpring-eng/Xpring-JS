import { CurrencyAmount } from '../Generated/web/org/xrpl/rpc/v1/amount_pb'
import XrpIssuedCurrency, { XRPIssuedCurrency } from './xrp-issued-currency'

/**
 * An amount of currency on the XRP Ledger
 * @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 *
 * @deprecated Use XrpCurrencyAmount.
 */
export class XRPCurrencyAmount {
  /**
   * Constructs an XRPCurrencyAmount from a CurrencyAmount.
   *
   * @param currencyAmount a CurrencyAmount (protobuf object) whose field values will be used
   *                       to construct an XRPCurrencyAmount
   * @returns an XRPCurrencyAmount with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/amount.proto#L10
   */
  public static from(
    currencyAmount: CurrencyAmount,
  ): XRPCurrencyAmount | undefined {
    switch (currencyAmount.getAmountCase()) {
      // Mutually exclusive: either drops or issuedCurrency is set in an XRPCurrencyAmount
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (issuedCurrencyAmount) {
          const issuedCurrency = XRPIssuedCurrency.from(issuedCurrencyAmount)
          if (issuedCurrency) {
            return new XRPCurrencyAmount(undefined, issuedCurrency)
          }
        }
        return undefined
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const drops = currencyAmount.getXrpAmount()?.getDrops()
        if (drops) {
          return new XRPCurrencyAmount(drops, undefined)
        }
        return undefined
      }
      default:
        return undefined
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
    readonly issuedCurrency?: XRPIssuedCurrency,
  ) {}
}

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
        return undefined
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const drops = currencyAmount.getXrpAmount()?.getDrops()
        if (drops) {
          return new XrpCurrencyAmount(drops, undefined)
        }
        return undefined
      }
      default:
        return undefined
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
