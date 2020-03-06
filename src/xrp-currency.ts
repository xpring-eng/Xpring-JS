import { Currency as pbCurrency } from './generated/web/org/xrpl/rpc/v1/amount_pb'

type Currency = pbCurrency.AsObject // TODO(amiecorso) decide how we want to typealias this and ideally maintain some sort of consistency when wrapping protos

/**
 * An issued currency on the XRP LEdger
 * - SeeAlso: https://xrpl.org/currency-formats.html#currency-codes
 */
export default class XRPCurrency {
  public name: string

  public code: string | Uint8Array

  public constructor(currency: Currency) {
    this.name = currency.name
    this.code = currency.code
  }
}
