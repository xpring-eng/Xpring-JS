import { Currency } from '../Generated/org/xrpl/rpc/v1/amount_pb'

/**
 * An issued currency on the XRP LEdger
 * @see: https://xrpl.org/currency-formats.html#currency-codes
 */
export default class XRPCurrency {
  /**
   * Constructs an XRPCurrency from a Currency.
   *
   * @param currency a Currency (protobuf object) whose field values will be used
   *                 to construct an XRPCurrency
   * @returns an XRPCurrency with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/amount.proto#L41
   */
  public static from(currency: Currency): XRPCurrency {
    return new XRPCurrency(currency.getName(), currency.getCode_asU8())
  }

  /**
   * @param name 3 character ASCII code
   * @param code 160 bit currency code. 20 bytes
   */
  private constructor(readonly name: string, readonly code: Uint8Array) {}
}
