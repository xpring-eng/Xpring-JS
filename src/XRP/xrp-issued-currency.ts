import bigInt, { BigInteger } from 'big-integer'
import XRPCurrency from './xrp-currency'
import { IssuedCurrencyAmount } from '../generated/web/org/xrpl/rpc/v1/amount_pb'

/*
 * An issued currency on the XRP Ledger
 * - SeeAlso: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XRPIssuedCurrency {
  public currency: XRPCurrency | undefined

  public value: BigInteger | undefined

  public issuer: string | undefined

  public static from(
    issuedCurrency: IssuedCurrencyAmount,
  ): XRPIssuedCurrency | undefined {
    const value = bigInt(issuedCurrency.getValue())
    if (value && typeof value === 'bigint') {
      return new XRPIssuedCurrency(issuedCurrency)
    }
    return undefined
  }

  public constructor(issuedCurrency: IssuedCurrencyAmount) {
    this.value = bigInt(issuedCurrency.getValue())
    const currency = issuedCurrency.getCurrency()
    if (currency) {
      this.currency = XRPCurrency.from(currency)
    }
    this.issuer = issuedCurrency.getIssuer()?.getAddress()
  }
}
