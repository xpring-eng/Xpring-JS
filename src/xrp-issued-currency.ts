import bigInt from 'big-integer'
// import bigInt from 'bigint-typescript-definitions'
import XRPCurrency from './xrp-currency'
import { IssuedCurrencyAmount } from './generated/web/org/xrpl/rpc/v1/amount_pb'

/*
 * An issued currency on the XRP Ledger
 * - SeeAlso: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XRPIssuedCurrency {
  public currency: XRPCurrency | undefined

  public value: BigInteger | undefined

  public issuer: string | undefined

  public constructor(issuedCurrency: IssuedCurrencyAmount) {
    const value = bigInt(issuedCurrency.getValue())
    if (value && typeof value === 'string') {
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
