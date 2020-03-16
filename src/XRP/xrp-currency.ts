import { Currency } from '../generated/web/org/xrpl/rpc/v1/amount_pb'

/**
 * An issued currency on the XRP LEdger
 * @see: https://xrpl.org/currency-formats.html#currency-codes
 */
export default class XRPCurrency {
  public static from(currency: Currency): XRPCurrency {
    return new XRPCurrency(currency.getName(), currency.getCode())
  }

  private constructor(
    readonly name: string,
    readonly code: string | Uint8Array,
  ) {}
}
