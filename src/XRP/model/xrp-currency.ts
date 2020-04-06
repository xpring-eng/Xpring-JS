import { Currency } from '../Generated/web/org/xrpl/rpc/v1/amount_pb'

/**
 * An issued currency on the XRP LEdger
 * @see: https://xrpl.org/currency-formats.html#currency-codes
 */
export default class XRPCurrency {
  public static from(currency: Currency): XRPCurrency {
    return new XRPCurrency(currency.getName(), currency.getCode_asU8())
  }

  /**
   * @param name 3 character ASCII code
   * @param code 160 bit currency code. 20 bytes
   */
  private constructor(readonly name: string, readonly code: Uint8Array) {}
}
