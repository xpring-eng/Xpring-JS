import { Payment } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrency from './xrp-currency'

type PathElement = Payment.PathElement

/*
 * A path step in an XRP Ledger Path.
 * @see: https://xrpl.org/paths.html#path-steps
 */
export default class XRPPathElement {
  public static from(pathElement: PathElement): XRPPathElement {
    const account = pathElement.getAccount()?.getAddress()
    const currency = pathElement.getCurrency()
    let xrpCurrency
    if (currency) {
      xrpCurrency = XRPCurrency.from(currency)
    } else {
      xrpCurrency = undefined
    }
    const issuer = pathElement.getIssuer()?.getAddress()
    return new XRPPathElement(account, xrpCurrency, issuer)
  }

  private constructor(
    readonly account?: string,
    readonly currency?: XRPCurrency,
    readonly issuer?: string,
  ) {}
}
