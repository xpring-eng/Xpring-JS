import { Payment } from '../Generated/web/org/xrpl/rpc/v1/transaction_pb'
import XrpCurrency, { XRPCurrency } from './xrp-currency'

type PathElement = Payment.PathElement

/**
 * A path step in an XRP Ledger Path.
 * @see: https://xrpl.org/paths.html#path-steps
 *
 * @deprecated Use XrpPathElement.
 */
export class XRPPathElement {
  /**
   * Constructs an XRPPathElement from a PathElement.
   *
   * @param pathElement a PathElement (protobuf object) whose field values will be used
   *                    to construct an XRPPathElement
   * @returns an XRPPathElement with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L227
   */
  public static from(pathElement: PathElement): XRPPathElement {
    const account = pathElement.getAccount()?.getAddress()
    const currency = pathElement.getCurrency()
    const xrpCurrency = currency && XRPCurrency.from(currency)
    const issuer = pathElement.getIssuer()?.getAddress()
    return new XRPPathElement(account, xrpCurrency, issuer)
  }

  /**
   *
   * @param account (Optional) If present, this path step represents rippling through the specified address.
   *                MUST NOT be provided if this path element specifies the currency or issuer fields.
   * @param currency (Optional) If present, this path element represents changing currencies through an order book.
   *                 The currency specified indicates the new currency. MUST NOT be provided if this path
   *                 element specifies the account field.
   * @param issuer (Optional) If present, this path element represents changing currencies and this address
   *                defines the issuer of the new currency. If omitted in a path element with a non-XRP currency,
   *                a previous element of the path defines the issuer. If present when currency is omitted,
   *                indicates a path element that uses an order book between same-named currencies with different issuers.
   *                MUST be omitted if the currency is XRP. MUST NOT be provided if this element specifies the account field.
   */
  private constructor(
    readonly account?: string,
    readonly currency?: XRPCurrency,
    readonly issuer?: string,
  ) {}
}

/*
 * A path step in an XRP Ledger Path.
 * @see: https://xrpl.org/paths.html#path-steps
 */
export default class XrpPathElement {
  /**
   * Constructs an XrpPathElement from a PathElement.
   *
   * @param pathElement a PathElement (protobuf object) whose field values will be used
   *                    to construct an XrpPathElement
   * @returns an XrpPathElement with its fields set via the analogous protobuf fields.
   * @see https://github.com/ripple/rippled/blob/develop/src/ripple/proto/org/xrpl/rpc/v1/transaction.proto#L227
   */
  public static from(pathElement: PathElement): XrpPathElement {
    const account = pathElement.getAccount()?.getAddress()
    const currency = pathElement.getCurrency()
    const xrpCurrency = currency && XRPCurrency.from(currency)
    const issuer = pathElement.getIssuer()?.getAddress()
    return new XrpPathElement(account, xrpCurrency, issuer)
  }

  /**
   *
   * @param account (Optional) If present, this path step represents rippling through the specified address.
   *                MUST NOT be provided if this path element specifies the currency or issuer fields.
   * @param currency (Optional) If present, this path element represents changing currencies through an order book.
   *                 The currency specified indicates the new currency. MUST NOT be provided if this path
   *                 element specifies the account field.
   * @param issuer (Optional) If present, this path element represents changing currencies and this address
   *                defines the issuer of the new currency. If omitted in a path element with a non-XRP currency,
   *                a previous element of the path defines the issuer. If present when currency is omitted,
   *                indicates a path element that uses an order book between same-named currencies with different issuers.
   *                MUST be omitted if the currency is XRP. MUST NOT be provided if this element specifies the account field.
   */
  private constructor(
    readonly account?: string,
    readonly currency?: XrpCurrency,
    readonly issuer?: string,
  ) {}
}
