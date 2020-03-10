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
          this.issuedCurrency = new XRPIssuedCurrency(issuedCurrencyAmount)
          this.drops = undefined
        }
        break
      }
      case CurrencyAmount.AmountCase.XRP_AMOUNT: {
        const dropsAmount = currencyAmount.getXrpAmount()
        if (dropsAmount) {
          this.drops = dropsAmount.getDrops()
          this.issuedCurrency = undefined
        }
        break
      }
      default:
    }
  }
}
