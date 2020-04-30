import bigInt, { BigInteger } from 'big-integer'
import { IssuedCurrencyAmount } from '../Generated/org/xrpl/rpc/v1/amount_pb'
import XRPCurrency from './xrp-currency'

/*
 * An issued currency on the XRP Ledger
 * @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 */
export default class XRPIssuedCurrency {
  /**
   * Constructs an XRPIssuedCurrency from an IssuedCurrencyAmount.
   *
   * @param issuedCurrency an IssuedCurrencyAmount (protobuf object) whose field values will be used
   *                       to construct an XRPIssuedCurrency
   * @returns an XRPIssuedCurrency with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/amount.proto#L28
   */
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

  /**
   *
   * @param currency The currency used to value the amount.
   * @param value The value of the amount.
   * @param issuer Unique account address of the entity issuing the currency.
   */
  private constructor(
    readonly currency?: XRPCurrency,
    readonly value?: BigInteger,
    readonly issuer?: string,
  ) {}
}
