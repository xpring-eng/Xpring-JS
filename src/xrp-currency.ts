import { Currency } from './generated/web/org/xrpl/rpc/v1/amount_pb'

/**
 * An issued currency on the XRP LEdger
 * - SeeAlso: https://xrpl.org/currency-formats.html#currency-codes
 */
export default class XRPCurrency {
  public name: string

  public code: string | Uint8Array

  public constructor(currency: Currency) {
    this.name = currency.getName()
    this.code = currency.getCode()
  }
}
