import { XrpError, XrpErrorType } from '..'
import bigInt, { BigInteger } from 'big-integer'
import { IssuedCurrencyAmount } from '../Generated/web/org/xrpl/rpc/v1/amount_pb'
import XrpCurrency from './xrp-currency'

/*
 * An issued currency on the XRP Ledger
 * @see: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
 * @see: https://xrpl.org/currency-formats.html#issued-currency-amounts
 */
export default class XrpIssuedCurrency {
  /**
   * Constructs an XrpIssuedCurrency from an IssuedCurrencyAmount.
   *
   * @param issuedCurrency an IssuedCurrencyAmount (protobuf object) whose field values will be used
   *                       to construct an XrpIssuedCurrency
   * @returns an XrpIssuedCurrency with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/amount.proto#L28
   */
  public static from(issuedCurrency: IssuedCurrencyAmount): XrpIssuedCurrency {
    const currency = issuedCurrency.getCurrency()
    if (!currency) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'IssuedCurrency protobuf does not contain `currency` field.',
      )
    }

    let value
    try {
      value = bigInt(issuedCurrency.getValue())
    } catch {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'Cannot construct BigInt from IssuedCurrency protobuf `value` field.',
      )
    }

    const issuer = issuedCurrency.getIssuer()?.getAddress()
    if (!issuer) {
      throw new XrpError(
        XrpErrorType.MalformedProtobuf,
        'IssuedCurrency protobuf does not contain `issuer` field.',
      )
    }
    return new XrpIssuedCurrency(XrpCurrency.from(currency), value, issuer)
  }

  /**
   * @param currency The currency used to value the amount.
   * @param value The value of the amount.
   * @param issuer Unique account address of the entity issuing the currency.
   */
  private constructor(
    readonly currency: XrpCurrency,
    readonly value: BigInteger,
    readonly issuer: string,
  ) {}
}
