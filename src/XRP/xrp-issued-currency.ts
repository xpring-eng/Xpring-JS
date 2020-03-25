import bigInt, { BigInteger } from 'big-integer'
import { IssuedCurrencyAmount } from './Generated/web/org/xrpl/rpc/v1/amount_pb'
import XRPCurrency from './xrp-currency'

/*
 * An issued currency on the XRP Ledger
 * @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XRPIssuedCurrency {
  public static from(
    issuedCurrency: IssuedCurrencyAmount,
  ): XRPIssuedCurrency | undefined {
    const currency = issuedCurrency.getCurrency()
    const xrpCurrency = currency && XRPCurrency.from(currency)

    let value
    try {
      value = bigInt(issuedCurrency.getValue())
    } catch {
      value = undefined
    }

    if (value) {
      const issuer = issuedCurrency.getIssuer()?.getAddress()
      return new XRPIssuedCurrency(xrpCurrency, value, issuer)
    }
    return undefined
  }

  private constructor(
    readonly currency?: XRPCurrency,
    readonly value?: BigInteger,
    readonly issuer?: string,
  ) {}
}
