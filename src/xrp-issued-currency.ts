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
  public value: string | undefined

  public issuer: string | undefined

  public constructor(issuedCurrency: IssuedCurrencyAmount) {
    // const value = bigInt(issuedCurrency.getValue())
    // if (!value) {
    //   return
    // }
    // this.value = value
    // Commenting this out ^^ for temporary testability of this class
    this.value = issuedCurrency.getValue()
    const currency = issuedCurrency.getCurrency()
    if (currency) {
      this.currency = new XRPCurrency(currency)
    }
    this.issuer = issuedCurrency.getIssuer()?.getAddress()
  }
}
