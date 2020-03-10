import XRPIssuedCurrency from './xrp-issued-currency'
import { CurrencyAmount } from './generated/web/org/xrpl/rpc/v1/amount_pb'

// An amount of currency on the XRP Ledger
// - SeeAlso: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
export default class XRPCurrencyAmount {
  // Mutually exclusive, only one of the below fields is set.
  public drops: string | undefined

  public issuedCurrency: XRPIssuedCurrency | undefined

  public constructor(currencyAmount: CurrencyAmount) {
    switch (currencyAmount.getAmountCase()) {
      case CurrencyAmount.AmountCase.ISSUED_CURRENCY_AMOUNT: {
        const issuedCurrencyAmount = currencyAmount.getIssuedCurrencyAmount()
        if (issuedCurrencyAmount) {
          const tempIssuedCurrency = new XRPIssuedCurrency(issuedCurrencyAmount)
          if (Object.keys(tempIssuedCurrency).length === 0) {
            // if XRPIssuedCurrency is empty due to bad input... abort
            return
          }
          this.issuedCurrency = tempIssuedCurrency
          this.drops = undefined
        }
        break
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const dropsAmount = currencyAmount.getXrpAmount()
        if (dropsAmount) {
          const tempDrops = dropsAmount.getDrops()
          if (!tempDrops) {
            // if drops are undefined... abort
            return
          }
          this.issuedCurrency = undefined
          this.drops = tempDrops
        }
        break
      }
      default:
    }
  }
}
