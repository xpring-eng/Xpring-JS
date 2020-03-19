import XRPIssuedCurrency from './xrp-issued-currency'
import { CurrencyAmount } from '../generated/web/org/xrpl/rpc/v1/amount_pb'

// An amount of currency on the XRP Ledger
// @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
export default class XRPCurrencyAmount {
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

  private constructor(
    readonly drops?: string,
    readonly issuedCurrency?: XRPIssuedCurrency,
  ) {}
}
