import { Payment } from '../generated/web/org/xrpl/rpc/v1/transaction_pb'
import XRPCurrency from './xrp-currency'

type PathElement = Payment.PathElement

/*
 * A path step in an XRP Ledger Path.
 * - SeeAlso: https://xrpl.org/paths.html#path-steps
 */
export default class XRPPathElement {
  public account: string | undefined

  public currency!: XRPCurrency | undefined

  public issuer: string | undefined

  public constructor(pathElement: PathElement) {
    this.account = pathElement.getAccount()?.getAddress()
    const currency = pathElement.getCurrency()
    if (currency) {
      this.currency = new XRPCurrency(currency)
    } else {
      this.currency = undefined
    }
    this.issuer = pathElement.getIssuer()?.getAddress()
  }
}
