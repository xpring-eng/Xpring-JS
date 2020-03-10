// import bigInt from 'big-integer' // commented out for temporary testability
// t checkimport bigInt from 'bigint-typescript-definitions'
import XRPCurrency from './xrp-currency'
import { IssuedCurrencyAmount } from './generated/web/org/xrpl/rpc/v1/amount_pb'

/*
 * An issued currency on the XRP Ledger
 * - SeeAlso: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XRPIssuedCurrency {
  public currency: XRPCurrency | undefined

  // public value: BigInteger | undefined // commented out for temporary testability of this class
  public value: number | undefined

  public issuer: string | undefined

  public constructor(issuedCurrency: IssuedCurrencyAmount) {
    // commenting this out for temporary testability of this class
    // using number instead of big-int for testing bad values
    // TODO: restore to big-int when type issues are resolved
    // const value = bigInt(issuedCurrency.getValue())
    const value = Number(issuedCurrency.getValue())
    if (value && typeof value === 'number') {
      this.value = value
    } else {
      return
    }
    const currency = issuedCurrency.getCurrency()
    if (currency) {
      this.currency = new XRPCurrency(currency)
    }
    this.issuer = issuedCurrency.getIssuer()?.getAddress()
  }
}
